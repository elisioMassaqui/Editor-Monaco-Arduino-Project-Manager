import os
import json
import subprocess
from flask import Flask, jsonify, request, send_from_directory, render_template
import logging

app = Flask(__name__)

# Configurações
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
PROJECTS_DIR = os.path.join(BASE_DIR, 'projects')
ARDUINO_CLI_PATH = 'arduino-cli'
BOARD_FQBN = 'arduino:avr:uno'

# Funções Utilitárias

def get_project_path(project_name):
    return os.path.join(PROJECTS_DIR, project_name)

def create_project_folder(project_name):
    project_path = get_project_path(project_name)
    if not os.path.exists(project_path):
        os.makedirs(project_path)
        with open(os.path.join(project_path, f"{project_name}.ino"), 'w') as f:
            f.write('// Código Arduino aqui\n')
        return True
    return False

def delete_project_folder(project_name):
    project_path = get_project_path(project_name)
    if os.path.exists(project_path):
        for root, dirs, files in os.walk(project_path, topdown=False):
            for name in files:
                os.remove(os.path.join(root, name))
            for name in dirs:
                os.rmdir(os.path.join(root, name))
        os.rmdir(project_path)
        return True
    return False

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/api/projects', methods=['GET'])
def list_projects():
    projects = [d for d in os.listdir(PROJECTS_DIR) if os.path.isdir(os.path.join(PROJECTS_DIR, d))]
    return jsonify(projects)

@app.route('/api/create_project', methods=['POST'])
def create_project():
    data = request.json
    project_name = data.get('project_name')
    if create_project_folder(project_name):
        return jsonify({"message": "Projeto criado com sucesso!"}), 201
    return jsonify({"message": "Projeto já existe ou erro ao criar!"}), 400

@app.route('/api/delete_project', methods=['POST'])
def delete_project():
    data = request.json
    project_name = data.get('project_name')
    if delete_project_folder(project_name):
        return jsonify({"message": "Projeto excluído com sucesso!"}), 200
    return jsonify({"message": "Projeto não encontrado!"}), 404

@app.route('/api/load_code', methods=['GET'])
def load_code():
    project_name = request.args.get('project_name')
    project_path = get_project_path(project_name)
    file_path = os.path.join(project_path, f"{project_name}.ino")
    if os.path.exists(file_path):
        with open(file_path, 'r') as f:
            code = f.read()
        return jsonify({"code": code})
    return jsonify({"message": "Código não encontrado!"}), 404

@app.route('/api/save_code', methods=['POST'])
def save_code():
    data = request.json
    project_name = data.get('project_name')
    code = data.get('code')
    project_path = get_project_path(project_name)
    file_path = os.path.join(project_path, f"{project_name}.ino")
    if os.path.exists(project_path):
        with open(file_path, 'w') as f:
            f.write(code)
        return jsonify({"message": "Código salvo com sucesso!"})
    return jsonify({"message": "Projeto não encontrado!"}), 404

@app.route('/api/compile_code', methods=['POST'])
def compile_code():
    project_name = request.json.get('project_name')
    project_path = get_project_path(project_name)
    file_path = os.path.join(project_path, f"{project_name}.ino")
    if os.path.exists(file_path):
        command = [ARDUINO_CLI_PATH, 'compile', '--fqbn', BOARD_FQBN, file_path]
        result = subprocess.run(command, capture_output=True, text=True)
        if result.returncode == 0:
            return jsonify({"message": "Compilação concluída com sucesso!", "output": result.stdout})
        else:
            return jsonify({"message": "Erro na compilação.", "error": result.stderr}), 500
    return jsonify({"message": "Projeto não encontrado!"}), 404

@app.route('/api/upload_code', methods=['POST'])
def upload_code():
    project_name = request.json.get('project_name')
    project_path = get_project_path(project_name)
    file_path = os.path.join(project_path, f"{project_name}.ino")
    if os.path.exists(file_path):
        upload_port = detect_arduino_port()
        if upload_port:
            command = [ARDUINO_CLI_PATH, 'upload', '--fqbn', BOARD_FQBN, '-p', upload_port[0], file_path]
            result = subprocess.run(command, capture_output=True, text=True)
            if result.returncode == 0:
                return jsonify({"message": "Upload concluído com sucesso!", "output": result.stdout})
            else:
                return jsonify({"message": "Erro no upload.", "error": result.stderr}), 500
        return jsonify({"message": "Porta Arduino não detectada!"}), 404
    return jsonify({"message": "Projeto não encontrado!"}), 404

def detect_arduino_port():
    """Detecta a porta onde o Arduino está conectado."""
    try:
        result = subprocess.run([ARDUINO_CLI_PATH, 'board', 'list'], capture_output=True, text=True)
        if result.returncode == 0:
            ports = []
            for line in result.stdout.splitlines():
                if 'Arduino' in line:
                    port = line.split()[0]
                    ports.append(port)
            return ports
        return None
    except FileNotFoundError:
        return None
    except Exception as e:
        return None

if __name__ == '__main__':
    logging.basicConfig(level=logging.INFO)
    app.run(host='0.0.0.0', debug=True, port=4040)

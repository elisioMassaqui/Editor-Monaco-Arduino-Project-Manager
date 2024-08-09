@app.route('/api/add_library', methods=['POST'])
def add_library():
    data = request.json
    library_name = data.get('library_name')
    if library_name:
        command = [ARDUINO_CLI_PATH, 'lib', 'install', library_name]
        result = subprocess.run(command, capture_output=True, text=True)
        if result.returncode == 0:
            return jsonify({"message": "Biblioteca instalada com sucesso!", "output": result.stdout})
        else:
            return jsonify({"message": "Erro ao instalar a biblioteca.", "error": result.stderr}), 500
    return jsonify({"message": "Nome da biblioteca não fornecido!"}), 400

@app.route('/api/remove_library', methods=['POST'])
def remove_library():
    data = request.json
    library_name = data.get('library_name')
    if library_name:
        command = [ARDUINO_CLI_PATH, 'lib', 'remove', library_name]
        result = subprocess.run(command, capture_output=True, text=True)
        if result.returncode == 0:
            return jsonify({"message": "Biblioteca removida com sucesso!", "output": result.stdout})
        else:
            return jsonify({"message": "Erro ao remover a biblioteca.", "error": result.stderr}), 500
    return jsonify({"message": "Nome da biblioteca não fornecido!"}), 400

@app.route('/api/list_libraries', methods=['GET'])
def list_libraries():
    command = [ARDUINO_CLI_PATH, 'lib', 'list']
    result = subprocess.run(command, capture_output=True, text=True)
    if result.returncode == 0:
        libraries = result.stdout.splitlines()
        return jsonify({"libraries": libraries})
    return jsonify({"message": "Erro ao listar bibliotecas.", "error": result.stderr}), 500

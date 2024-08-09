// Configuração do CDN do editor
require.config({
    paths: { 
        'vs': 'https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.51.0-dev-20240628/min/vs' 
    }
});

// Inicializa o editor de código e configurações
require(['vs/editor/editor.main'], function() {
    // Pega todos os elementos da tela
    const createProjectButton = document.getElementById('createProjectButton');
    const loadProjectButton = document.getElementById('loadProjectButton');
    const deleteProjectButton = document.getElementById('deleteProjectButton');
    const saveCodeButton = document.getElementById('saveCodeButton');
    const compileCodeButton = document.getElementById('compileCodeButton');
    const uploadCodeButton = document.getElementById('uploadCodeButton');
    const projectNameInput = document.getElementById('projectNameInput');
    const loadProjectSelect = document.getElementById('loadProjectSelect');
    const codeEditorContainer = document.getElementById('codeEditor');
    const consoleDiv = document.getElementById('console');

    // Configura o editor de código
    const codeEditor = monaco.editor.create(codeEditorContainer, {
        value: '',
        language: 'cpp',
        theme: 'vs-dark'
    });

    // Atualiza o console
    function updateConsole(message) {
        consoleDiv.textContent += message + "\n";
        consoleDiv.scrollTop = consoleDiv.scrollHeight;
    }

    // Mostra alerta
    function showAlert(message) {
        alert(message);
    }

    // Atualiza a lista de projetos na UI
    function updateProjectsList() {
        fetch('/api/projects')
            .then(response => response.json())
            .then(data => {
                loadProjectSelect.innerHTML = ''; // Limpa a lista atual
                data.forEach(project => {
                    const option = document.createElement('option');
                    option.value = project;
                    option.textContent = project;
                    loadProjectSelect.appendChild(option);
                });
            });
    }

    // Função para criar projeto
    function createProject() {
        const projectName = projectNameInput.value.trim();
        if (!projectName) {
            alert('O projeto precisa ter um nome, por favor');
            return;
        }
        fetch('/api/create_project', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ project_name: projectName })
        })
        .then(response => response.json())
        .then(data => {
            updateConsole(data.message);
            showAlert(data.message);
            updateProjectsList();
        });
    }

    // Função para carregar projeto
    function loadProject() {
        const projectName = loadProjectSelect.value;
        if (!projectName) {
            alert('Selecione um projeto, por favor');
            return;
        }
        fetch(`/api/load_code?project_name=${projectName}`)
            .then(response => response.json())
            .then(data => {
                if (data.code) {
                    codeEditor.setValue(data.code);
                } else {
                    updateConsole(data.message);
                    showAlert(data.message);
                }
            });
    }

    // Função para deletar projeto
    function deleteProject() {
        const projectName = loadProjectSelect.value;
        if (!projectName) {
            alert('Selecione um projeto, por favor');
            return;
        }
        fetch('/api/delete_project', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ project_name: projectName })
        })
        .then(response => response.json())
        .then(data => {
            showAlert(data.message);
            updateConsole(data.message);
            updateProjectsList();
        });
    }

    // Função para salvar código
    function saveCode() {
        const projectName = loadProjectSelect.value.trim();
        const code = codeEditor.getValue();
        if (!projectName) {
            alert('Nenhum projeto selecionado');
            return;
        }
        fetch('/api/save_code', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ project_name: projectName, code: code })
        })
        .then(response => response.json())
        .then(data => {
            updateConsole(data.message);
        });
    }

    // Função para compilar código
    function compileCode() {
        const projectName = loadProjectSelect.value.trim();
        if (!projectName) {
            alert('Nenhum projeto selecionado');
            return;
        }
        fetch('/api/compile_code', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ project_name: projectName })
        })
        .then(response => response.json())
        .then(data => {
            updateConsole(data.message);
            if (data.output) {
                updateConsole(data.output);
            }
            if (data.error) {
                alert('Salve o código antes de compilar. Se o erro persistir, verifique o console');
                updateConsole(data.error);
            }
        });
    }

    // Função para carregar código para a placa
    function uploadCode() {
        const projectName = loadProjectSelect.value.trim();
        if (!projectName) {
            alert('Nenhum projeto selecionado');
            return;
        }
        fetch('/api/upload_code', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ project_name: projectName })
        })
        .then(response => response.json())
        .then(data => {
            updateConsole(data.message);
            if (data.output) {
                updateConsole(data.output);
            }
            if (data.error) {
                alert('Compile o código antes de enviar. Se o erro persistir, verifique o console');
                updateConsole(data.error);
            }
        });
    }

    // Adiciona eventos aos botões
    createProjectButton.addEventListener('click', createProject);
    loadProjectButton.addEventListener('click', loadProject);
    deleteProjectButton.addEventListener('click', deleteProject);
    saveCodeButton.addEventListener('click', saveCode);
    compileCodeButton.addEventListener('click', compileCode);
    uploadCodeButton.addEventListener('click', uploadCode);

    
    // Executa salvar, compilar e enviar com um clique
    function executar() {
        saveCode();
        compileCode();
        uploadCode();
    }

    document.getElementById('code').addEventListener('click', executar);

    // Atualiza a lista de projetos ao iniciar o app
    updateProjectsList();
    
});

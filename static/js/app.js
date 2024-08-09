//Pegar CDN do editor
require.config({
    paths: { 
        'vs': 'https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.51.0-dev-20240628/min/vs' 
    }
});

//Pegar todos elementos da tela pra escutar seus eventos
require(['vs/editor/editor.main'], function() {
    const createProjectButton = document.getElementById('createProjectButton');
    const loadProjectButton = document.getElementById('loadProjectButton');
    const deleteProjectButton = document.getElementById('deleteProjectButton');
    const saveCodeButton = document.getElementById('saveCodeButton');
    const compileCodeButton = document.getElementById('compileCodeButton');
    const uploadCodeButton = document.getElementById('uploadCodeButton');

    const projectNameInput = document.getElementById('projectNameInput');
    const loadProjectNameInput = document.getElementById('loadProjectNameInput');
    const codeEditorContainer = document.getElementById('codeEditor');
    const projectsList = document.getElementById('projectsList');
    const consoleDiv = document.getElementById('console');

    //Editor de código e configurações iniciais
    const codeEditor = monaco.editor.create(codeEditorContainer, {
        value: '',
        language: 'cpp',
        theme: 'vs-dark'
    });

    //Atualizar as informações do console
    function updateConsole(message) {
        consoleDiv.textContent += message + "\n";
        consoleDiv.scrollTop = consoleDiv.scrollHeight;
    }

    //Mostrar alerta, positivo ou negativo
    function showAlert(message) {
        alert(message);
    }

    //Atualizar lista de projectos na UI
    function updateProjectsList() {
        fetch('/api/projects')
            .then(response => response.json())
            .then(data => {
                projectsList.innerHTML = '';
                data.forEach(project => {
                    const li = document.createElement('li');
                    li.textContent = project;
                    projectsList.appendChild(li);
                });
            });
    }

    //Gerenciamento de projectos
    //Criar Projecto
    createProjectButton.addEventListener('click', function() {
        const projectName = projectNameInput.value.trim();
        if (projectName == '') {
            alert('O projecto precisar ter nome, por favor')
        }
        if (projectName) {
            fetch('/api/create_project', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ project_name: projectName })
            })
            .then(response => response.json())
            .then(data => {
                updateConsole(data.message)
                showAlert(data.message);
                updateProjectsList();
            });
        }else{
            alert('Algo deu errado, verifique o nome que estás a tentar inserir', data.error)
        }
    });

    //Carregar projecto
    loadProjectButton.addEventListener('click', function() {
        const projectName = loadProjectNameInput.value.trim();
        if (projectName == '') {
            alert('O projecto precisar ter nome, por favor')
        }
        if (projectName) {
            fetch(`/api/load_code?project_name=${projectName}`)
                .then(response => response.json())
                .then(data => {
                    if (data.code) {
                        codeEditor.setValue(data.code);
                    } else {
                        updateConsole(data.message)
                        showAlert(data.message);
                    }
                });
        }
    });

    //Deletar projecto
    deleteProjectButton.addEventListener('click', function() {
        const projectName = loadProjectNameInput.value.trim();
        if (projectName == '') {
            alert('O projecto precisar ter nome, por favor')
        }
        if (projectName) {
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
    });



    //Gerenciamento de código
    //Salvar código
    function saveCode() {
        const projectName = loadProjectNameInput.value.trim();
        const code = codeEditor.getValue();
        if (projectName) {
            fetch('/api/save_code', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ project_name: projectName, code: code })
            })
            .then(response => response.json())
            .then(data => {
                updateConsole(data.message);
                //showAlert(data.message);
            });
        }else{
            alert('Nenhum projecto selecionado')
        }
    }


    //Compilar código
    function compileCode() {
        const projectName = loadProjectNameInput.value.trim();
        if (projectName) {
            fetch('/api/compile_code', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ project_name: projectName })
            })
            .then(response => response.json())
            .then(data => {
                updateConsole(data.message);
                if (data.output) {
                    //alert('Código compilado com sucesso')
                    updateConsole(data.output);
                }
                if (data.error) {
                    alert('Salve o código antes de compilar, se o erro persistir, verifique o console')
                    updateConsole(data.error);
                }
            });
        }else{
            alert('Nenhum projecto selecionado')
        }
    }


    //Carregar código para placa
    function uploadCode() {
        const projectName = loadProjectNameInput.value.trim();
        if (projectName) {
            fetch('/api/upload_code', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ project_name: projectName })
            })
            .then(response => response.json())
            .then(data => {
                updateConsole(data.message);
                if (data.output) {
                    //alert('Código enviado para placa com sucesso')
                    updateConsole(data.output);
                }
                if (data.error) {
                    alert('Compile o código antes de enviar, se o erro persistir, verifique o console')
                    updateConsole(data.error);
                }
            });
        }else{
            alert('Nenhum projecto selecionado')
        }
    }

    //Chamar funções de código
    //Salvar
    saveCodeButton.addEventListener('click', function() {saveCode()});
    //Compilar
    compileCodeButton.addEventListener('click', function() {compileCode()});
    //Enviar
    uploadCodeButton.addEventListener('click', function() {uploadCode()});

    //Chamar os tres aqui automaticamente com apenas um clique
    function executar() {
        saveCode()
        compileCode()
        uploadCode()
    }
    document.getElementById('code').addEventListener('click', function name(params) {
        executar()
        console.log('executado')
    })

    //Atualizar lista de projectos ao iniciar o app
    updateProjectsList();
});

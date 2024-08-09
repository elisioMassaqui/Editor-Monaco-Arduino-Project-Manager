require.config({
    paths: { 
        'vs': 'https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.51.0-dev-20240628/min/vs' 
    }
});

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

    const codeEditor = monaco.editor.create(codeEditorContainer, {
        value: '',
        language: 'cpp',
        theme: 'vs-dark'
    });

    function updateConsole(message) {
        consoleDiv.textContent += message + "\n";
        consoleDiv.scrollTop = consoleDiv.scrollHeight;
    }

    function showAlert(message) {
        alert(message);
    }

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
        }
    });

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

    saveCodeButton.addEventListener('click', function() {
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
                showAlert(data.message);
            });
        }else{
            alert('Nenhum projecto selecionado')
        }
    });

    compileCodeButton.addEventListener('click', function() {
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
                    alert('Código compilado com sucesso')
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
    });

    uploadCodeButton.addEventListener('click', function() {
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
                    alert('Código enviado para placa com sucesso')
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
    });

    updateProjectsList();
});

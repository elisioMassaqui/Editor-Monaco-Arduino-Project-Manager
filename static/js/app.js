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
        if (projectName) {
            fetch('/api/create_project', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ project_name: projectName })
            })
            .then(response => response.json())
            .then(data => {
                showAlert(data.message); // Mostra alerta em vez de atualizar o console
                updateProjectsList();
            });
        }
    });

    loadProjectButton.addEventListener('click', function() {
        const projectName = loadProjectNameInput.value.trim();
        if (projectName) {
            fetch(`/api/load_code?project_name=${projectName}`)
                .then(response => response.json())
                .then(data => {
                    if (data.code) {
                        codeEditor.setValue(data.code);
                    } else {
                        showAlert(data.message); // Mostra alerta em vez de atualizar o console
                    }
                });
        }
    });

    deleteProjectButton.addEventListener('click', function() {
        const projectName = loadProjectNameInput.value.trim();
        if (projectName) {
            fetch('/api/delete_project', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ project_name: projectName })
            })
            .then(response => response.json())
            .then(data => {
                showAlert(data.message); // Mostra alerta em vez de atualizar o console
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
                showAlert(data.message); // Mostra alerta em vez de atualizar o console
            });
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
                    updateConsole(data.output);
                }
                if (data.error) {
                    updateConsole(data.error);
                }
            });
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
                    updateConsole(data.output);
                }
                if (data.error) {
                    updateConsole(data.error);
                }
            });
        }
    });

    updateProjectsList();
});

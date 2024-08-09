require.config({ paths: { 'vs': 'https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.51.0-dev-20240628/min/vs' }});
require(['vs/editor/editor.main'], function() {
    const codeEditor = monaco.editor.create(document.getElementById('codeEditor'), {
        value: '',
        language: 'cpp',
        theme: 'vs-dark'
    });

    function updateConsole(message) {
        const consoleDiv = document.getElementById('console');
        consoleDiv.textContent += message + "\n";
        consoleDiv.scrollTop = consoleDiv.scrollHeight;
    }

    document.getElementById('createProjectButton').addEventListener('click', function() {
        const projectName = document.getElementById('projectNameInput').value.trim();
        if (projectName) {
            fetch('/api/create_project', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ project_name: projectName })
            })
            .then(response => response.json())
            .then(data => {
                updateConsole(data.message);
            });
        }
    });

    document.getElementById('loadProjectButton').addEventListener('click', function() {
        const projectName = document.getElementById('projectNameInput').value.trim();
        if (projectName) {
            fetch(`/api/load_code?project_name=${projectName}`)
                .then(response => response.json())
                .then(data => {
                    if (data.code) {
                        codeEditor.setValue(data.code);
                    } else {
                        updateConsole(data.message);
                    }
                });
        }
    });

    document.getElementById('deleteProjectButton').addEventListener('click', function() {
        const projectName = document.getElementById('projectNameInput').value.trim();
        if (projectName) {
            fetch('/api/delete_project', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ project_name: projectName })
            })
            .then(response => response.json())
            .then(data => {
                updateConsole(data.message);
            });
        }
    });

    document.getElementById('saveCodeButton').addEventListener('click', function() {
        const projectName = document.getElementById('projectNameInput').value.trim();
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
            });
        }
    });

    document.getElementById('compileCodeButton').addEventListener('click', function() {
        const projectName = document.getElementById('projectNameInput').value.trim();
        if (projectName) {
            fetch('/api/compile_code', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ project_name: projectName })
            })
            .then(response => response.json())
            .then(data => {
                updateConsole(data.message + "\n" + (data.output || data.error));
            });
        }
    });

    document.getElementById('uploadCodeButton').addEventListener('click', function() {
        const projectName = document.getElementById('projectNameInput').value.trim();
        if (projectName) {
            fetch('/api/upload_code', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ project_name: projectName })
            })
            .then(response => response.json())
            .then(data => {
                updateConsole(data.message + "\n" + (data.output || data.error));
            });
        }
    });
});

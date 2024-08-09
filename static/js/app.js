document.addEventListener('DOMContentLoaded', function() {
    const createProjectButton = document.getElementById('createProjectButton');
    const loadProjectButton = document.getElementById('loadProjectButton');
    const deleteProjectButton = document.getElementById('deleteProjectButton');
    const saveCodeButton = document.getElementById('saveCodeButton');
    const compileCodeButton = document.getElementById('compileCodeButton');
    const uploadCodeButton = document.getElementById('uploadCodeButton');

    const projectNameInput = document.getElementById('projectNameInput');
    const loadProjectNameInput = document.getElementById('loadProjectNameInput');
    const codeEditor = document.getElementById('codeEditor');
    const projectsList = document.getElementById('projectsList');

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
                alert(data.message);
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
                        codeEditor.value = data.code;
                    } else {
                        alert(data.message);
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
                alert(data.message);
                updateProjectsList();
            });
        }
    });

    saveCodeButton.addEventListener('click', function() {
        const projectName = loadProjectNameInput.value.trim();
        const code = codeEditor.value;
        if (projectName) {
            fetch('/api/save_code', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ project_name: projectName, code: code })
            })
            .then(response => response.json())
            .then(data => {
                alert(data.message);
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
                alert(data.message);
                if (data.output) {
                    console.log(data.output);
                }
                if (data.error) {
                    console.error(data.error);
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
                alert(data.message);
                if (data.output) {
                    console.log(data.output);
                }
                if (data.error) {
                    console.error(data.error);
                }
            });
        }
    });

    updateProjectsList();
});

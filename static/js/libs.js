document.addEventListener('DOMContentLoaded', () => {
    const installedLibrariesSelect = document.getElementById('installedLibrariesSelect');
    const installLibraryButton = document.getElementById('installLibraryButton');
    const uninstallLibraryButton = document.getElementById('uninstallLibraryButton');
    const libraryNameInput = document.getElementById('libraryNameInput');

    function updateLibraries() {
        fetch('/api/installed_libraries')
            .then(response => response.json())
            .then(data => {
                installedLibrariesSelect.innerHTML = '';
                data.libraries.forEach(library => {
                    const option = document.createElement('option');
                    option.value = library;
                    option.textContent = library;
                    installedLibrariesSelect.appendChild(option);
                });
            });
    }

    function installLibrary() {
        const libraryName = libraryNameInput.value.trim();
        if (!libraryName) {
            alert('Digite o nome da biblioteca para instalar.');
            return;
        }
        fetch('/api/install_library', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ library_name: libraryName })
        })
        .then(response => response.json())
        .then(data => {
            alert(data.message);
            updateLibraries();
        });
    }

    function uninstallLibrary() {
        const libraryName = installedLibrariesSelect.value;
        if (!libraryName) {
            alert('Selecione uma biblioteca para desinstalar.');
            return;
        }
        fetch('/api/uninstall_library', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ library_name: libraryName })
        })
        .then(response => response.json())
        .then(data => {
            alert(data.message);
            updateLibraries();
        });
    }

    installLibraryButton.addEventListener('click', installLibrary);
    uninstallLibraryButton.addEventListener('click', uninstallLibrary);

    // Atualiza as bibliotecas ao iniciar
    updateLibraries();
});
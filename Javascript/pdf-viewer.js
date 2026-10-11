window.addEventListener('DOMContentLoaded', () => {
    const pdfList = document.getElementById('pdf-list');
    const pdfViewer = document.getElementById('pdf-viewer');

    // List of PDF file names
    // const pdfFiles = []; //is defined in the html script

    function isMobile() {
        return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    }

    // Function to load PDF
    function loadPDF(pdfFileName) {
        if (isMobile()) {
            // On mobile: open in new tab [men er kinda i samme side]
            window.open(pdfFileName, '_blank');
        } else {
            // On desktop: load in iframe
            pdfViewer.src = pdfFileName;
        }
    }

    // Loop through the PDF files and create buttons
    pdfFiles.forEach(fileName => {
        const button = document.createElement('button');
        button.textContent = fileName;
        button.addEventListener('click', () => {
            // Load the PDF into the iframe when a button is clicked
            loadPDF(fileName);
        });
        pdfList.appendChild(button);
    });
    /*
    const pdfFolders = [
        'Prosess',
    ];
    const folderFiles = {
        'Prosess': {
            'Øvinger': {
                'Øving_11.pdf':null
            },
            'Prosjekt': {
                'Prosessteknikk.pdf': null,
                'Kodee': {
                    'constants8.txt': null,
                    'Enthalpybalance.txt': null,
                }
            },
        },
        'Uorganisk': {} // er en link
    };
    function buildTree(obj, currentPath = '') { //obj = folderName i folderFiles, currenPath sin input = f.eks. 'Øvinger' og 'Prosjekt' 
        const ul = document.createElement('ul') // lager øverste liste
        for (const key in obj) {
            const li = document.createElement('li') // lager liste inni ul (ul>li)
            const fullPath = currentPath ? '${currentPath}/${key}': key; // i Python: full_path = f"{current_path}/{key}" if current_path else key  // currentpath/key = Prosess/Prosjekt (om Prosess eksisterer)
            if (typeof obj[key] === 'object' && obj[key] !== null) {
            // folder
                li.textContent = key; //innhold i denne listen skal være key
                li.classlist.add('folder') // ? 
                li.addEventlistener('click', (e) => {
                    e.stopPropagation();
                    const sub = li.querySelector('ul');
                    if (sub) sub.style.display = sub.style.display === 'none' ? 'block' : 'none';
                });
                const subU1 = 

            }
        }
    }
    */
});

/* i HTML; 

<script src="script.js"></script>

<script>
    var buildtree = "Hello world";
    doSomething();
</script>

*/
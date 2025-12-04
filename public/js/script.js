// Environment configuration
const API_CONFIG = {
    development: {
        baseURL: ''
    },
    production: {
        baseURL: '/json-sorter'
    }
};

// Detect environment based on hostname
const ENV = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' 
    ? 'development' 
    : 'production';

const API_BASE_URL = API_CONFIG[ENV].baseURL;

const light = {
    'primary': '#F8FBFF',
    'secondary': '#F8FBFF',
    'third': '#eaeaea',
    'fourth': '#27272A',
    'background-color': '#FFFFFF',
    'icon-color': '#68676D',
    'text-color': '#000000',
    'area-color': '#000',
    'button-color': '#000',
    'button-bg-color': '#828EF7'
}

const dark = {
    'primary': '#1C1B22',
    'secondary': '#3D3D40',
    'third': '#68676D',
    'fourth': '#27272A',
    'background-color': '#000000',
    'icon-color': '#68676D',
    'text-color': '#FFFFFF',
    'area-color': '#000',
    'button-color': '#000',
    'button-bg-color': '#828EF7'
}

document.addEventListener("DOMContentLoaded", () => {
    const sortButton = document.getElementById('sortButton');
    const copyButton = document.getElementById('copyButton');
    const clearButton = document.getElementById('clearButton');

    const chkPlainArray = document.getElementById('chkPlainArray');
    const chkIdentation = document.getElementById('chkIdentation');
    const chkArb = document.getElementById('chkArb');

    setThemeFromStorage();

    if (sortButton) {
        sortButton.addEventListener('click', async () => {
            const jsonInput = document.getElementById('inputJson').value;
            const order = document.getElementById('order').value;

            const plainArrays = chkPlainArray.checked;
            const indentation = chkIdentation.checked ? 'tabs' : 'spaces'; //spaces or tabs
            const arbSupport = chkArb.checked;

            try {
                const response = await fetch(`${API_BASE_URL}/sort`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ 
                        json: JSON.parse(jsonInput), 
                        order,
                        plainArrays,
                        indentation,
                        arbSupport
                    })
                });

                if (!response.ok) {
                    throw new Error('Error en la solicitud al servidor');
                }

                const result = await response.json();

                let formattedOutput;
                if (indentation === 'tabs') {
                    formattedOutput = JSON.stringify(result, null, '\t');
                } else {
                    formattedOutput = JSON.stringify(result, null, 2);
                }

                document.getElementById('outputJson').value = formattedOutput;
            } catch (error) {
                showToast('Error: Invalid JSON', 'error');
                console.error(error);
            }
        });
    }

    if (copyButton) {
        copyButton.addEventListener('click', () => {
            const outputJson = document.getElementById('outputJson');
            outputJson.select();
            document.execCommand('copy');
            showToast('JSON copied to clipboard.', 'info');
        });
    }

    if (clearButton) {
        clearButton.addEventListener('click', () => {
            document.getElementById('inputJson').value = "";
            document.getElementById('outputJson').value = "";
        });
    }

    document.getElementById('lightButton').addEventListener('click', () => {
        localStorage.setItem("theme", "dark");
        setTheme(dark);
        document.getElementById('darkButton').style.display = "flex"; 
        document.getElementById('lightButton').style.display = "none"; 
    });
    document.getElementById('darkButton').addEventListener('click', () => {
        localStorage.setItem("theme", "light");
        setTheme(light);
        document.getElementById('darkButton').style.display = "none"; 
        document.getElementById('lightButton').style.display = "flex";
    });
    
});

function setTheme(a_oTheme) {
    Object.keys(a_oTheme).forEach(k => {
            document.documentElement.style.setProperty(`--${k}`, a_oTheme[k])
        }
    );
}

function setThemeFromStorage() {
    const theme = localStorage.getItem("theme");
    if (theme === "dark") {
        setTheme(dark);
        document.getElementById('darkButton').style.display = "flex"; 
        document.getElementById('lightButton').style.display = "none"; 
    } else {
        setTheme(light);
        document.getElementById('darkButton').style.display = "none"; 
        document.getElementById('lightButton').style.display = "flex";
    }
}

function showToast(message, type) {
    const toast = document.createElement('div');
    toast.className = 'toast ' + type;
    toast.innerText = message;
    document.body.appendChild(toast);
    setTimeout(() => {
        toast.style.opacity = '0';
        setTimeout(() => toast.remove(), 500);
    }, 3000);
}
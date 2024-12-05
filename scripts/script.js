document.addEventListener("DOMContentLoaded", () => {
    // Labels, years, and glasses lists
    const infoLabels = [
        'Uso Siroko Desde...',
        'POR UNAS GAFAS SIROKO, YO...',
        'LO PROMETIDO ES DEUDA'
    ];
    const yearsList = [2016, 2017, 2018, 2019, 2020, 2021];
    const glassesList = ['Segaría a navaja', 'Rechazaría un cachopo', 'Renunciaría a mis tierras', 'Regalaría una ternera'];
    const formData = [
        { class: '.years', list: yearsList, name: 'year' },
        { class: '.gafas', list: glassesList, name: 'glasses' }
    ];

    // Variables
    let selectedYear = yearsList[0].toString();
    let selectedGlasses = glassesList[0];
    let coupon = '';
    const timerDuration = 60 * 20; // 20 minutes
    let currentTab = 0;

    // Helper: Build form dynamically
    const buildForm = ({ class: formClass, list, name }) => {
        const formContainer = document.querySelector(formClass);
        formContainer.innerHTML = list
            .map((item, index) => `
                <label class="form-radio flex ${index === 0 ? 'active' : ''}">
                    <input type="radio" name="${name}" value="${item}" ${index === 0 ? 'checked' : ''}>
                    <span>${item}</span>
                </label>
            `)
            .join('');
    };

    // Helper: Update tab content
    const showTabs = (index) => {
        const tabs = document.getElementsByClassName("tab");
        Array.from(tabs).forEach(tab => tab.classList.remove('flex'));
        tabs[index].classList.add('flex');

        document.getElementById("form-title").textContent = infoLabels[index];

        if (index < 2) {
            // Handle generate radio buttons
            buildForm(formData[index]);
        } else {
            // Handle Coupon
            document.getElementById('coupon').textContent = coupon;
            document.getElementById("chip").textContent = 'TU PREMIO ESTÁ LISTO';
            startTimer(timerDuration, document.querySelector('#timer'));
        }

        const chipText = index === tabs.length - 1
            ? 'TU PREMIO ESTÁ LISTO'
            : `paso ${index + 1} de ${tabs.length - 1}`;
        document.getElementById("chip").textContent = chipText;
    };

    // Helper: Start timer
    const startTimer = (duration, display) => {
        let timer = duration;
        const timerInterval = setInterval(() => {
            const minutes = String(Math.floor(timer / 60)).padStart(2, '0');
            const seconds = String(timer % 60).padStart(2, '0');
            display.textContent = `${minutes}:${seconds}`;
            // Check end of timer
            if (--timer < 0) {
                clearInterval(timerInterval);
                display.innerHTML = `Código caducado. <a href="javascript:window.location.reload();" class='white-link reiniciar'>Reiniciar</a>.`;
                document.querySelector('.timer-container').classList.replace('timer-running', 'timer-expired');
                // Handle hide the button to copy the coupon when the timer expires, if you want to keep it comment on the following line of code
                document.querySelector('.copy-button').classList.add('hidden');
                // the possibility of selecting and copying the coupon at the end of the timer is denied if you uncomment the following line of code
                // document.getElementById('coupon').classList.add('select-none')
            }
        }, 1000);
    };

    // Generate coupon
    const generateCoupon = () => {
        // - Primero: La suma de los últimos dos números del año elegido en el paso 1. (Ejemplo: 1 + 7 = 8)
        let yearDigitsSum = parseInt(selectedYear[2]) + parseInt(selectedYear[3]);
        // For the 2019 selection the sum of 1 and 9 is 10 which are two digits, to obtain only one digit uncomment the following line of code
        // yearDigitsSum = yearDigitsSum % 9 || 9;
        const glassesCode = selectedGlasses.toUpperCase().replace(/[\sA]/g, '').slice(-4);
        coupon = `${yearDigitsSum}${glassesCode}`;
    };

    // Change color of selected option
    const changeColor = (event) => {
        const parent = event.currentTarget;
        parent.querySelectorAll('.active').forEach(el => el.classList.remove('active'));
        event.target.closest('.form-radio').classList.add('active');
    };

    // Move to the next tab
    const nextTab = () => {
        const tabs = document.getElementsByClassName("tab");
        tabs[currentTab].classList.remove('flex');
        currentTab++;

        if (currentTab !== 0) document.querySelector('.subtitle').classList.add('hidden')

        if (currentTab === 2) generateCoupon()

        showTabs(currentTab);
    };

    // Add event listeners to forms
    const addEventListeners = () => {
        // Changes
        document.querySelector('.form-group.years').addEventListener('change', (event) => {
            if (event.target.type === 'radio') selectedYear = event.target.value;
        });
        document.querySelector('.form-group.gafas').addEventListener('change', (event) => {
            if (event.target.type === 'radio') selectedGlasses = event.target.value;
        });
        document.querySelector('.years').addEventListener('change', changeColor, true);
        document.querySelector('.gafas').addEventListener('change', changeColor, true);
        // Clicks
        document.querySelector('.year-button').addEventListener('click', nextTab, true);
        document.querySelector('.gafa-button').addEventListener('click', nextTab, true);
        document.querySelector('.copy-button').addEventListener('click', () => {
            navigator.clipboard.writeText(coupon);
            document.getElementById('copy-text').textContent = 'Copiado';
        }, true);
    };

    // Initialize
    addEventListeners();
    showTabs(currentTab);
});

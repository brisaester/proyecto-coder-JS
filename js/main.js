document.getElementById('loan-form').addEventListener('submit', function(e) {
    e.preventDefault(); 

    // Obtener valores del formulario
    const amount = parseFloat(document.getElementById('amount').value);
    const annualInterestRate = parseFloat(document.getElementById('interest').value) / 100; // Tasa de interés anual en formato decimal
    const numberOfPayments = parseInt(document.getElementById('years').value); // Cantidad de cuotas (meses)

    // Verificar si el monto del préstamo es mayor a 10000
    if (amount > 10000) {
        // Calcular pagos mensuales
        const monthlyPayment = calculateMonthlyPayment(amount, annualInterestRate / 12, numberOfPayments);

        // Mostrar resultados
        if (isFinite(monthlyPayment)) {
            const totalPayment = monthlyPayment * numberOfPayments;
            const totalInterest = totalPayment - amount;
            document.getElementById('monthly-payment').textContent = monthlyPayment.toFixed(2);
            document.getElementById('total-payment').textContent = totalPayment.toFixed(2);
            document.getElementById('total-interest').textContent = totalInterest.toFixed(2);

            // Mostrar mensaje de éxito
            mostrarMensajeExito('Cálculo realizado con éxito!');
        } else {
            alert('Por favor, revisa los valores ingresados');
        }
    } else {
        alert('El monto del préstamo debe ser mayor a 10000.');
    }
});

// Función para calcular el pago mensual
function calculateMonthlyPayment(amount, monthlyInterestRate, numberOfPayments) {
    if (monthlyInterestRate === 0) {
        return amount / numberOfPayments;
    }
    const x = Math.pow(1 + monthlyInterestRate, numberOfPayments);
    return (amount * monthlyInterestRate * x) / (x - 1);
}

// Función para mostrar mensajes de éxito 
function mostrarMensajeExito(mensaje) {
    const mensajeElemento = document.getElementById('message');
    mensajeElemento.textContent = mensaje;
    mensajeElemento.style.display = 'block'; // Mostrar mensaje
}

class Prestamo {
    constructor(id, monto, plazo) {
        this.id = id;
        this.monto = monto;
        this.tasaInteres = 23; // Tasa de interés fija del 23%
        this.plazo = plazo;
    }

    calcularCuotaMensual() {
        const tasaMensual = this.tasaInteres / 12 / 100;
        const cuota = this.monto * tasaMensual / (1 - Math.pow(1 + tasaMensual, -this.plazo));
        return cuota.toFixed(2);
    }
}
let prestamos = [];

// Función para cargar préstamos desde MI archivo JSON local PRESTAMOS.JSON
const cargarPrestamosDesdeJSON = async () => {
    try {
        const response = await fetch('prestamos.json'); //mi achivo local prestamos.json para usar FETCH.
        if (!response.ok) {
            throw new Error('Error al cargar los préstamos');
        }
        const data = await response.json();
        
        // USANDO ESTRUCTURA DE PRESTAMOS.JSON
        prestamos = data.map(({ id, monto, plazo }) => new Prestamo(id, monto, plazo));
        
        // Guardar préstamos en localStorage
        guardarPrestamosEnStorage();
    } catch (error) {
        console.error('Error:', error);
    }
};

// Guardar préstamos en el localStorage
const guardarPrestamosEnStorage = () => {
    localStorage.setItem('prestamos', JSON.stringify(prestamos));
};

// Cargar préstamos desde el localStorage
const cargarPrestamosDeStorage = () => {
    const prestamosGuardados = localStorage.getItem('prestamos');
    if (prestamosGuardados) {
        prestamos = JSON.parse(prestamosGuardados).map(({ id, monto, plazo }) => new Prestamo(id, monto, plazo));
    }
};

// Buscar préstamo por ID
const buscarPrestamoPorId = id => prestamos.find(prestamo => prestamo.id === id);

// Filtrar préstamos por monto
const filtrarPrestamosPorMonto = (min, max) => 
    prestamos.filter(prestamo => prestamo.monto >= min && prestamo.monto <= max);

// Inicializa y carga los préstamos desde el JSON
cargarPrestamosDesdeJSON().then(() => {
    console.log('Préstamos cargados desde JSON y guardados en localStorage');
}).catch(error => {
    console.error('Error al cargar préstamos desde JSON:', error);
});

// Cargar préstamos desde localStorage al iniciar
cargarPrestamosDeStorage(); 

// Eventos para buscar préstamo
document.getElementById('buscarPrestamo').addEventListener('click', () => {
    const id = parseInt(document.getElementById('prestamoId').value);
    if (!isNaN(id)) {
        const prestamoBuscado = buscarPrestamoPorId(id);
        if (prestamoBuscado) {
            console.log(prestamoBuscado);
            console.log(`Cuota mensual: $${prestamoBuscado.calcularCuotaMensual()}`);
        } else {
            console.log('Préstamo no encontrado');
        }
    } else {
        console.log('ID inválido');
    }
});

// Evento para filtrar préstamos
document.getElementById('filtrarPrestamos').addEventListener('click', () => {
    const min = parseFloat(document.getElementById('montoMin').value);
    const max = parseFloat(document.getElementById('montoMax').value);
    
    if (!isNaN(min) && !isNaN(max) && min >= 0 && max >= 0) {
        if (min > max) {
            console.log('Monto mínimo no puede ser mayor que el monto máximo');
        } else {
            const prestamosFiltrados = filtrarPrestamosPorMonto(min, max);
            console.log(prestamosFiltrados);
        }
    } else {
        console.log('Monto mínimo o máximo inválido');
    }
});

// Librería, activa al hacer click en calcular
document.getElementById("calcularBtn").addEventListener("click", function() {
    Toastify({
        text: "PROMOCIÓN! Obtén tu préstamo ahora y recibe una entrada para ver Deadpool",
        duration: 6000,
        gravity: "top", 
        position: "center",
        style: {
            background: "green"
        }
    }).showToast(); 
});

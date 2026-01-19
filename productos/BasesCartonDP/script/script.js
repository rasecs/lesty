const products = [
    {
        id: 1,
        name: "Base Dorada Redonda",
        desc: "Base de cartón rígido con acabado dorado brillante. Ideal para pasteles elegantes.",
        price: 13.00,
        dims: "25cm diámetro",
        color: "Dorado",
        img: "img/gold_round.png"
    },
    {
        id: 2,
        name: "Base Plateada Cuadrada",
        desc: "Base cuadrada resistente con acabado plateado. Perfecta para pasteles modernos.",
        price: 18.00,
        dims: "30x30cm",
        color: "Plateado",
        img: "img/silver_square.png"
    },
    {
        id: 3,
        name: "Base Blanca Rectangular",
        desc: "Base rectangular clásica, acabado mate. Ideal para gelatinas grandes.",
        price: 12.50,
        dims: "20x30cm",
        color: "Blanco",
        img: "img/white_rect.png"
    },
    {
        id: 4,
        name: "Base Dorada Mini",
        desc: "Pack de 10 bases mini para postres individuales.",
        price: 25.00,
        dims: "10cm diámetro",
        color: "Dorado",
        img: "img/gold_round.png" // Reusing image for demo
    },
    {
        id: 5,
        name: "Base Plateada Cuadrada",
        desc: "Base cuadrada resistente con acabado plateado. Perfecta para pasteles modernos.",
        price: 18.00,
        dims: "30x30cm",
        color: "Plateado",
        img: "img/silver_square.png"
    },
    {
        id: 5,
        name: "Base Blanca Rectangular",
        desc: "Base rectangular clásica, acabado mate. Ideal para gelatinas grandes.",
        price: 12.50,
        dims: "20x30cm",
        color: "Blanco",
        img: "img/white_rect.png"
    }
];

let cart = [];

document.addEventListener('DOMContentLoaded', () => {
    renderProducts();
    updateCartUI();

    // Modal Logic
    const modal = document.getElementById('productModal');
    const closeBtn = document.querySelector('.close-modal');

    closeBtn.onclick = () => modal.style.display = "none";
    window.onclick = (e) => {
        if (e.target == modal) modal.style.display = "none";
    }

    // Export Buttons
    document.getElementById('downloadBtn').addEventListener('click', downloadCSV);
    document.getElementById('emailBtn').addEventListener('click', sendEmail);
    document.getElementById('whatsappCopyBtn').addEventListener('click', copyForWhatsApp);

    // Cuadro Elements - Dimension boxes interaction
    // Referenced in: productos.html - #contenedor .cuadro elements
    initializeDimensionBoxes();
});

/**
 * Initialize dimension boxes (cuadro elements)
 * Adds click handlers to show selected dimension
 * Referenced in: productos.html - #contenedor .cuadro elements
 */
function initializeDimensionBoxes() {
    const cuadros = document.querySelectorAll('.cuadro');

    cuadros.forEach(cuadro => {
        cuadro.addEventListener('click', function () {
            // Remove active class from all cuadros
            cuadros.forEach(c => c.classList.remove('active'));

            // Add active class to clicked cuadro
            this.classList.add('active');

            // Get the dimension text (e.g., "10x10")
            const dimension = this.textContent;
            console.log('Dimensión seleccionada:', dimension);

            // You can add additional functionality here
            // For example, filter products by dimension, show price, etc.
        });
    });
}

function renderProducts() {
    const grid = document.getElementById('productsGrid');
    grid.innerHTML = products.map(product => `
        <div class="product-card">
            <div class="card-img">
                <img src="${product.img}" alt="${product.name}">
            </div>
            <div class="card-info">
                <h3>${product.name}</h3>
                <span class="price">$${product.price.toFixed(2)}</span>
                <div class="card-actions">
                    <button class="btn-details" onclick="openModal(${product.id})">Detalles</button>
                    <button class="btn-add" onclick="addToCart(${product.id}, 1)">Agregar</button>
                </div>
            </div>
        </div>
    `).join('');
}

function openModal(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    document.getElementById('modalImg').src = product.img;
    document.getElementById('modalTitle').innerText = product.name;
    document.getElementById('modalDesc').innerText = product.desc;
    document.getElementById('modalDims').innerText = product.dims;
    document.getElementById('modalColor').innerText = product.color;
    document.getElementById('modalPrice').innerText = `$${product.price.toFixed(2)}`;

    const addBtn = document.getElementById('modalAddBtn');
    addBtn.onclick = () => {
        const qty = parseInt(document.getElementById('modalQty').value);
        addToCart(product.id, qty);
        document.getElementById('productModal').style.display = "none";
    };

    document.getElementById('productModal').style.display = "flex";
}

function addToCart(productId, qty) {
    const product = products.find(p => p.id === productId);
    const existingItem = cart.find(item => item.id === productId);

    if (existingItem) {
        existingItem.qty += qty;
    } else {
        cart.push({ ...product, qty });
    }

    updateCartUI();
}

function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    updateCartUI();
}

function updateCartUI() {
    const cartContainer = document.getElementById('cartItems');
    const countSpan = document.getElementById('cartCount');
    const totalSpan = document.getElementById('cartTotal');
    const downloadBtn = document.getElementById('downloadBtn');
    const emailBtn = document.getElementById('emailBtn');
    const whatsappBtn = document.getElementById('whatsappCopyBtn');

    countSpan.innerText = `(${cart.reduce((acc, item) => acc + item.qty, 0)})`;

    if (cart.length === 0) {
        cartContainer.innerHTML = '<p class="empty-cart">Tu lista está vacía.</p>';
        totalSpan.innerText = '$0.00';
        downloadBtn.disabled = true;
        emailBtn.disabled = true;
        whatsappBtn.disabled = true;
        return;
    }

    downloadBtn.disabled = false;
    emailBtn.disabled = false;
    whatsappBtn.disabled = false;

    let total = 0;
    cartContainer.innerHTML = cart.map(item => {
        const itemTotal = item.price * item.qty;
        total += itemTotal;
        return `
            <div class="cart-item">
                <div class="item-details">
                    <h4>${item.name}</h4>
                    <span class="item-price">${item.qty} x $${item.price.toFixed(2)}</span>
                </div>
                <button class="item-remove" onclick="removeFromCart(${item.id})">&times;</button>
            </div>
        `;
    }).join('');

    totalSpan.innerText = `$${total.toFixed(2)}`;
}

function copyForWhatsApp() {
    let text = "*Pedido Lesty*\n\n";
    let total = 0;

    cart.forEach(item => {
        const itemTotal = item.price * item.qty;
        total += itemTotal;
        text += `📦 *${item.name}*\n   Cant: ${item.qty} | $${itemTotal.toFixed(2)}\n`;
    });

    text += `\n💰 *Total: $${total.toFixed(2)}*`;

    navigator.clipboard.writeText(text).then(() => {
        const btn = document.getElementById('whatsappCopyBtn');
        const originalText = btn.innerHTML;
        btn.innerHTML = "¡Copiado!";
        setTimeout(() => {
            btn.innerHTML = originalText;
        }, 2000);
    }).catch(err => {
        console.error('Error al copiar: ', err);
    });
}

function downloadCSV() {
    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += "Producto,Cantidad,Precio Unitario,Total\n";

    let total = 0;
    cart.forEach(item => {
        const itemTotal = item.price * item.qty;
        total += itemTotal;
        csvContent += `${item.name},${item.qty},${item.price.toFixed(2)},${itemTotal.toFixed(2)}\n`;
    });

    csvContent += `,,Total,${total.toFixed(2)}`;

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "lista_lesty.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

function sendEmail() {
    let body = "Hola Lesty, me gustaría cotizar los siguientes productos:\n\n";
    let total = 0;

    cart.forEach(item => {
        const itemTotal = item.price * item.qty;
        total += itemTotal;
        body += `- ${item.name} (${item.qty} pzas): $${itemTotal.toFixed(2)}\n`;
    });

    body += `\nTotal Estimado: $${total.toFixed(2)}`;

    const mailtoLink = `mailto:ventas@lesty.com?subject=Cotización de Productos&body=${encodeURIComponent(body)}`;
    window.location.href = mailtoLink;
}

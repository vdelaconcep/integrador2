
// Mostrar página principal
const renderIndexApp = (req, res) => {
    res.render(`index`, {title:''});
};

// Mostrar páginas secundarias
const renderApp = (req, res) => {
    const pagina = `${req.url.slice(1)}`;
    const paginaConMayuscula = pagina[0].toUpperCase() + pagina.slice(1)
    res.render(pagina, { title: `- ${paginaConMayuscula}` });
};


module.exports = {
    renderIndexApp,
    renderApp
}
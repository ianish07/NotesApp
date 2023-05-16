//Get Homepage

exports.homepage = async (req, res) => {
    const locals = {
        title: "Notes App",
        description: "Nodejs notes App"
    };
    res.render('index', {
        locals,
        layout: '../views/layouts/front-page'
    });

}

//Get About

exports.about = async (req, res) => {
    const locals = {
        title: "About - Notes App",
        description: "Nodejs notes App"
    };
    res.render('about', locals);

}
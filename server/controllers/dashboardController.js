// Get Dashboard

exports.dashboard = async (req, res) => {
    const locals = {
        title: "Dashboard",
        description: "Nodejs notes App"
    };
    res.render('dashboard/index', {
        locals,
        layout: '../views/layouts/dashboard'
    });

}
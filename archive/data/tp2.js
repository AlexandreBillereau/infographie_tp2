let camera;
let last_render = Date.now();

// Propriétés des étoiles
let n_stars = 64;
let star_color = [1,1,1,1]
let star_size = 2.0
let stars = {x: [], y: [], z: []}

// Propriété du système solaire
let orbit_angle = 0.0; // theta2
let orbit_duration = 15; // seconds
let orbit_n_segments = 64;
let orbit_scaling = 5;

// Propriétés de la planète
let sphereIFS;
let fichier_sphere = "tp2_sphere.obj"
let fichier_texture = "tp2_texture_planete.jpg"
let planete_tx = 0;
let planete_day_duration = 5; // second
let planete_angle = 0;

// Propriétés du satellite
let satelliteIFS;
let fichier_satellite = "satellite_solution.obj"
let satellite_orbit_duration = 3; // seconds
let satellite_orbit_angle = 0; // theta1


function generate_randomStars() {
    // TODO: a) Génération d'étoiles aléatoires.
}

function generate_pyramid_IFS(){
    // TODO: a) Génération du modèle IFS pour les pyramides (points de Lagrange)
    let model = {}

    // Votre code ici

    return model
}

function draw_pyramid(position_x, position_y, color) {
    
    // TODO: a) Fonction pour dessiner une pyramide.
    // Input : model (format ifs), position (array), scale (float), color (array)
    glPushMatrix()
    glVertexPointer(3, GL_FLOAT, 0, tetraedre_vertex_coords)
    glColor3f(...color)
    glTranslatef(position_x, position_y, 0)
    glRotatef(180,1,0,0)
    glScalef(0.2, 0.2,0.2)
    glEnableClientState( GL_VERTEX_ARRAY )
    glEnableClientState( GL_COLOR_ARRAY )
    glDrawElements( GL_TRIANGLES, 12, GL_UNSIGNED_INT, sommet_indice )
    glPopMatrix()

}

function draw_sun(model, scale) {
    // TODO: a) Fonction pour dessiner le soleil
    // Input : model (format ifs), scale (float)

    
    glPushMatrix();
    glEnableClientState(GL_NORMAL_ARRAY)
    glEnableClientState(GL_VERTEX_ARRAY)
    glVertexPointer(3.0, GL_FLOAT, 0, sphereIFS.vertexPositions)
    glNormalPointer(GL_FLOAT, 0, sphereIFS.vertexNormals)
    
    glColor3f(1,1,0)
    glDrawElements(GL_TRIANGLE_FAN, sphereIFS.parts["Sphere_Sphere.001"].length , GL_UNSIGNED_INT, sphereIFS.parts["Sphere_Sphere.001"])
    glPopMatrix()

}

function draw_earth(model, scale) {
    // TODO: a) Fonction pour dessiner le soleil
    // Input : model (format ifs), scale (float)

    // TODO: b) Utilisez la texture importée
    
}

function draw_stars() {
    // TODO: a) Dessiner les étoiles alétoires générées par generate_randomStars()
    
}

function draw_orbit(color){
    // TODO: a) CFonction pour dissiner une orbite circulaire
    // Input : color (array)
    var rayon = 1*orbit_scaling;
    var nSegments = 64;

    glPushMatrix()
    glBegin(GL_LINE_LOOP);
    for (i = 0; i < nSegments; i++) {
        angle = 2 * Math.PI * i / nSegments;
        x = rayon * Math.cos(angle);
        y = rayon * Math.sin(angle);
        glColor3f(1,1,1)
        glVertex2f( x, y);
    }
    glEnd();
    glPopMatrix()
}

function draw_satellite(position, scale){
    // TODO c) Fonction pour dessiner le satellite
    // Input : position (array), scale (float)
}

function draw_lagrange_points(){

    //L1
    var rayon = 0.7 * orbit_scaling
    draw_pyramid(rayon * Math.cos(degToRad(0)), rayon * Math.sin(degToRad(180)), [1,0,0])

    //L2
    rayon = 1.3 * orbit_scaling
    draw_pyramid(rayon * Math.cos(degToRad(0)), rayon * Math.sin(degToRad(180)), [0,1,0])

    //L3
    rayon = 1 * orbit_scaling
    draw_pyramid(rayon * Math.cos(degToRad(180)), rayon * Math.sin(degToRad(180)), [0,0,1])

    //L4
    rayon = 1 * orbit_scaling
    draw_pyramid(rayon * Math.cos(degToRad(60)), rayon * Math.sin(degToRad(60)), [1,1,0])
    
    //L5
    rayon = 1 * orbit_scaling
    draw_pyramid(rayon * Math.cos(degToRad(-60)), rayon * Math.sin(degToRad(-60)), [0,1,1])
    
}

function degToRad(deg){
  return deg*Math.PI/180
}

function draw() {
    // Fonction principale pour dessiner la scène complète
    glClear(GL_COLOR_BUFFER_BIT | GL_DEPTH_BUFFER_BIT);
    camera.apply();
    glScalef(.1,.1,.1)

    

    // draw_pyramid();
    draw_sun();

    
    draw_orbit()

    draw_lagrange_points()

    // Votre code ici. Vous devez appeler les fonctions draw* précédente dans le bon ordre
    // et effectuer les transformations requises.

    last_render = Date.now();
}

function update() {
    // Fonction pour animer la scène 3D

    // Temps depuis le dernier dessin
    let dt = Date.now() - last_render; // ms

    // Votre code ici

    draw();
    requestAnimationFrame(update);
}

function init() {
    try {
        glsimUse("canvas");
    }
    catch (e) {
        document.getElementById("canvas-holder").innerHTML="<p><b>Sorry, an error occurred:<br>" +
            e + "</b></p>";
        return;
    }

    // États d'OpenGL à activer
    glEnable(GL_POINT_SMOOTH);

    // glEnable(GL_LIGHTING);
    // TODO: gerer la lumiere
    glEnable(GL_NORMALIZE);

    glEnable(GL_DEPTH_TEST);
    glClearColor(0,0,0,1);

    // Caméara
    camera = new Camera();
    camera.setScale(0.75);
    camera.lookAt(0,1,5);

    // Création d'une pyramide
    // pyramidIFS = generate_pyramid_IFS(); // TODO: a) décommentez cette fonction

    // Création du modèle IFS pour la planète et le soleil (sphère).
    sphereIFS = loadOBJFile(fichier_sphere);

    // Load the satellite
    // satelliteIFS = loadOBJFile(fichier_satellite); // TODO: c) Décommenter cette ligne pour importer votre satellite

    // Génération d'étoiles
    // generate_randomStars() // TODO: a) Décommenter cette ligne

    // TODO b) : Importer les textures
    // VOTRE CODE ICI

    // Pour l'interactivité avec la souris.
    camera.installTrackball(draw);

    // Premier appel de update()
    update();
}
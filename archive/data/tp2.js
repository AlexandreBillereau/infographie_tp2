let camera;
let last_render = Date.now();

//Propriétés des pyramides
let pyramide_scale = [.2,.2,.2]
let pyramide_rotation = [180,1,0,0]

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

function draw_earth(model, scale) {
    // TODO: a) Fonction pour dessiner le soleil
    // Input : model (format ifs), scale (float)

    // TODO: b) Utilisez la texture importée
    
}

function draw_stars() {
    // TODO: a) Dessiner les étoiles alétoires générées par generate_randomStars()
    
}


function draw_satellite(position, scale){
    // TODO c) Fonction pour dessiner le satellite
    // Input : position (array), scale (float)
}


function degToRad(deg){
  return deg*Math.PI/180
}

function draw_scene() {
    // Fonction principale pour dessiner la scène complète
    glClear(GL_COLOR_BUFFER_BIT | GL_DEPTH_BUFFER_BIT)
    camera.apply()

    scene = new Scene()
    drawable = scene.create()

    drawable.forEach(element => {
        element.draw()
    });

    last_render = Date.now();
}

function update() {
    // Fonction pour animer la scène 3D

    // Temps depuis le dernier dessin
    let dt = Date.now() - last_render; // ms

    draw_scene();
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

    // Création du modèle IFS pour la planète et le soleil (sphère).
    sphereIFS = loadOBJFile(fichier_sphere);

    // Load the satellite
    // satelliteIFS = loadOBJFile(fichier_satellite); // TODO: c) Décommenter cette ligne pour importer votre satellite

    // Génération d'étoiles
    // generate_randomStars() // TODO: a) Décommenter cette ligne

    // TODO b) : Importer les textures
    // VOTRE CODE ICI

    // Pour l'interactivité avec la souris.
    camera.installTrackball(draw_scene);

    // Premier appel de update()
    update();
}


class Drawable{

    constructor(){
        if(this.constructor == Drawable){
            throw "cette classe abstraite ne peut être instancié"
        }
    }

    draw(){
        throw "cette fonction doit être redéfinite"
    }

    _color_not_three_args(color){
        return !color.length === 3
    }

    _scale_not_three_args(scale){
        return !scale.length === 3
    }

}

class Orbite extends Drawable{
    constructor(color){
        super()
        if(this._color_not_three_args(color)){
            throw "Sphere constructeur n'a pas un code rgb en couleur"
        }

        this.color = color
    }

    draw(){
        var rayon = 1*orbit_scaling;
        var nSegments = 64;

        glPushMatrix()
        glBegin(GL_LINE_LOOP);
        for (var i = 0; i < nSegments; i++) {
            var angle = 2 * Math.PI * i / nSegments;
            var x = rayon * Math.cos(angle);
            var y = rayon * Math.sin(angle);
            glColor3f(...this.color)
            glVertex2f( x, y);
        }
        glEnd();
        glPopMatrix()
    }
}

class Sphere extends Drawable{
    
    constructor(IFS, color, scale, x, y){

        super()

        this._IFS = IFS;
        this.x = x;
        this.y = y;

        if(this._color_not_three_args(color)){
            throw "Sphere constructeur n'a pas un code rgb en couleur"
        }
        if(this._scale_not_three_args(scale)){
            throw "Sphere construsteur n'a pas trois argument"
        }

        this._color = color;
        this._scale = scale;


    }

    draw(){


        glPushMatrix();

        glEnableClientState(GL_NORMAL_ARRAY)
        glEnableClientState(GL_VERTEX_ARRAY)
        // glEnableClientState(GL_TEXTURE_COORD_ARRAY)
        glVertexPointer(3.0, GL_FLOAT, 0, this._IFS.vertexPositions)
        glNormalPointer(GL_FLOAT, 0, this._IFS.vertexNormals)
        // glTexCoordPointer(2, GL_FLOAT, 0,  this._IFS.texturePositions)
        
        glTranslatef(this.x, this.y  , 0)
        glColor3f(...this._color)
        glScalef(...this._scale)
        glDrawElements(GL_TRIANGLE_FAN, this._IFS.parts["Sphere_Sphere.001"].length , GL_UNSIGNED_INT, this._IFS.parts["Sphere_Sphere.001"])
        // console.log(this._IFS)
        
        glPopMatrix()

    }
}

class Pyramide extends Drawable{
 
    constructor(x,y,color){
        super()
        this.x = x
        this.y = y

        if(this._color_not_three_args(color)){
            throw "Sphere constructeur n'a pas un code rgb en couleur"
        }

        this.color = color
    }

    draw(){
        glPushMatrix()
        glVertexPointer(3, GL_FLOAT, 0, tetraedre_vertex_coords)
        glColor3f(...this.color)
        glTranslatef(this.x, this.y, 0)
        glRotatef(...pyramide_rotation)
        glScalef(...pyramide_scale)
        glEnableClientState( GL_VERTEX_ARRAY )
        glEnableClientState( GL_COLOR_ARRAY )
        glDrawElements( GL_TRIANGLES, 12, GL_UNSIGNED_INT, sommet_indice )
        glPopMatrix()
    }
}

class L1 extends Pyramide{

    constructor(){

        var rayon = 0.7 * orbit_scaling
        var x = rayon * Math.cos(degToRad(0))
        var y = rayon * Math.sin(degToRad(180))

        //Rouge
        var color = [1,0,0]

        super(x,y,color);
    }

}

class L2 extends Pyramide{
    constructor(){

        var rayon = 1.3 * orbit_scaling
        var x = rayon * Math.cos(degToRad(0))
        var y = rayon * Math.sin(degToRad(180))

        //Vert
        var color = [0,1,0]

        super(x,y,color);
    }

}

class L3 extends Pyramide{
    constructor(){

        var rayon = 1 * orbit_scaling
        var x = rayon * Math.cos(degToRad(180))
        var y = rayon * Math.sin(degToRad(180))

        //Bleu
        var color = [0,0,1]

        super(x,y,color);
    }

}

class L4 extends Pyramide{
    constructor(){

        var rayon = 1 * orbit_scaling
        var x = rayon * Math.cos(degToRad(60))
        var y = rayon * Math.sin(degToRad(60))

        //Jaune
        var color = [1,1,0]

        super(x,y,color);
    }

}

class L5 extends Pyramide{
    constructor(){

        var rayon = 1 * orbit_scaling
        var x = rayon * Math.cos(degToRad(-60))
        var y = rayon * Math.sin(degToRad(-60))

        //Jaune
        var color = [0,1,1]

        super(x,y,color);
    }

}


class Earth extends Sphere{

    constructor(){
        var rayon = 1 * orbit_scaling
        var x = rayon * Math.cos(degToRad(0))
        var y = rayon * Math.sin(degToRad(180))

        super(sphereIFS, [0,1,0], [.5,.5,.5], x, y)
    }

}

 UsableObject = {

    Sun(){
        return new Sphere(sphereIFS, [1,1,0], [1,1,1], 0, 0)
    },

    pyramide(){
        return new Pyramide(10, 0, [1,0,0])
    },

    L1(){
        return new L1()
    },

    L2(){
        return new L2()
    },

    L3(){
        return new L3()
    },

    L4(){
        return new L4()
    },

    L5(){
        return new L5()
    },

    Orbite(){
        return new Orbite([1,1,1])
    },

    Earth(){
        return new Earth()
    }

}

class Scene {

    //ajouter les élements que l'on veux voir dans la scène.
    create(){
        scene = []
        glScalef(.1,.1,.1)

        scene.push(UsableObject.Sun())
        scene.push(UsableObject.L1())
        scene.push(UsableObject.L2())
        scene.push(UsableObject.L3())
        scene.push(UsableObject.L4())
        scene.push(UsableObject.L5())
        scene.push(UsableObject.Orbite())
        scene.push(UsableObject.Earth())

        return scene
    }

    

}


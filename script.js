//Colores
c_fondo = "#ddf1fa";
c_abierta = "#ff9780";
c_cerrada = "#90d6f5";
c_camino = "#f5f190";
c_borde = "#000000";
c_inicio = "#1a237e";
c_fin = "#4caf50";
c_fin_2 = "#89d18c";

// funcion para la ubicacion en la matriz
function Lugar(i, j, inicio_i, inicio_j, fin_i, fin_j) {
  // Se coloca la ubicacion
  this.i = i;
  this.j = j;
  //Se coloca pesos y vlores de heuristica
  this.g = 0;
  this.h = 0;
  this.f = 0;

  // Se inicializa la matriz para los vecinos
  this.vecinos = [];
  this.muro = false;
  this.meta = false;
  
  // se inicializa la variable anterior
  this.previous = undefined;

  //Colocando los muros
  if (i == 1 && j == 1) { this.muro = true; }
  else if (i == 1 && j == 0) { this.muro = true; }
  
 //Colocando Inicio y Fin
  if (i == inicio_i && j == inicio_j) { this.meta = true; }
  else if (i == fin_i && j == fin_j) { this.meta = true; }
 
  // Mostrar 
  this.show = function(col) {
    if (this.muro) {
      fill(0);
      strokeWeight(2);
      stroke(c_borde);
      rect(this.i * w, this.j * h, w, h);
    } else if (col) {
      fill(col);
      strokeWeight(2);
      stroke(c_borde);
      rect(this.i * w, this.j * h, w, h);
    }
  };

  // Funcion para revisar a los vecinos
  this.addVecinos = function(grid1a) {
    var i = this.i;
    var j = this.j;
    if (i < cols - 1) {
      this.vecinos.push(grid1a[i + 1][j]);
    }
    if (i > 0) {
      this.vecinos.push(grid1a[i - 1][j]);
    }
    if (j < rows - 1) {
      this.vecinos.push(grid1a[i][j + 1]);
    }
    if (j > 0) {
      this.vecinos.push(grid1a[i][j - 1]);
    }
  };
}

function Inventario(i, j) {
  // Se coloca la ubicacion
  this.i = i;
  this.j = j;
}

// Funcion que elimina los elementos del arreglo
function removeFromArray(arr, elt) {
  for (var i = arr.length - 1; i >= 0; i--) {
    if (arr[i] == elt) {
      arr.splice(i, 1);
    }
  }
}

// Funcion para la Heuristica Manhattan
function heuristic(cActual, cMeta) {
  var d = abs(cMeta.i - cActual.i) + abs(cMeta.j - cActual.j);
  return d;
}

// Se Crean las Columnas y Renglones
var cols = 4;
var rows = 4;

//Se declaran variables para el ancho y la altura
var w, h;

// creamos el grid1a 2D array
var grid1a = new Array(cols);
var grid1b = new Array(cols);
var grid2a = new Array(cols);
var grid2b = new Array(cols);
var grid3a = new Array(cols);
var grid3b = new Array(cols);

// Se crea el arreglo para el path
var path1a = [];
var path1b = [];
var path2a = [];
var path2b = [];
var path3a = [];
var path3b = [];

//Se crean canvas para mostrar caminos
var canvas1a;
var canvas1b;
var canvas2a;
var canvas2b;
var canvas3a;
var canvas3b;

//Funciones que configuran parametros y ejecutan algoritmos A* segun el tipo de inicio y final
//Se crean los diferentes problemas a resolver
function setUp1a(){
//Inventario
  //var m1 = new Inventario(); m1.i = 0; m1.j = 2;
  //var aInventarios = new Array();
  //aInventarios.push(m1);
  setupCanvas(canvas1a, 'div_canvas_1a', grid1a, 2, 2, 0, 0, 'table_1a', path1a,'table_1a_resultado', true, null);
}

function setUp1b(){
  setupCanvas(canvas1b, 'div_canvas_1b', grid1b, 0, 0, 3, 3, 'table_1b', path1b, 'table_1b_resultado', false, null);
}

function setUp2a(){
  setupCanvas(canvas2a, 'div_canvas_2a', grid2a, 2, 2, 0, 2, 'table_2a', path2a,'table_2a_resultado', true, null);
}

function setUp2b(){
  setupCanvas(canvas2b, 'div_canvas_2b', grid2b, 0, 2, 2, 3, 'table_2b', path2b, 'table_2b_resultado', false, null);
}

function setUp3a(){
  setupCanvas(canvas3a, 'div_canvas_3a', grid3a, 2, 2, 3, 0, 'table_3a', path3a,'table_3a_resultado', true, null);
}

function setUp3b(){
  setupCanvas(canvas3b, 'div_canvas_3b', grid3b, 3, 0, 1, 3, 'table_3b', path3b, 'table_3b_resultado', false, null);
}


function setup(){
  //Llama al primer problema por resolver
   setUp1a();
}

//Seteamos datos que seran usados para ejecutar A*, dibujar canvas y mostrar resultados
function setupCanvas(canvas, divCanvas, grid, inicio_i, inicio_j, fin_i, fin_j, tableId, path, tableAccionesId, isTomar, inventarios) {
  canvas = createCanvas(300, 300);//Se crea un canvas
  canvas.parent(divCanvas);
  console.log('A*');//se revisa en Consola el inicio del algoritmo

  //Limpiamos tabla de resultados
  initTable(tableId);

  // Se crea el tamaño de las casillas
  w = canvas.width / cols;
  h = canvas.height / rows;

  // Creamos el arreglo para inicializar arreglo de filas y columnas
  for (var i = 0; i < cols; i++) {
    grid[i] = new Array(rows);
  }

  //LLenamos grid con objeto Lugar
  for (var i = 0; i < cols; i++) {
    for (var j = 0; j < rows; j++) {
      grid[i][j] = new Lugar(i, j, inicio_i, inicio_j, fin_i, fin_j);
    }
  }

  //Agregamos inventarios como pared
  if(inventarios != null){
    for(var i = 0; i< inventarios.length; i++){
      grid[inventarios[i].i][inventarios[i].j].muro = true;
    }
  }

  //Encontramos todos sus vecinos
  for (var i = 0; i < cols; i++) {
    for (var j = 0; j < rows; j++) {
      grid[i][j].addVecinos(grid);
    }
  }

  //Seleccionamos Lugar inicio y Lugar fin
  var inicio = grid[inicio_i][inicio_j];
  var fin = grid[fin_i][fin_j];

  //Iniciamos proceso con las variables seteadas
  this.iniciar(canvas, inicio, fin, tableId, path, grid, tableAccionesId, isTomar);
}

//Funcion de canvas para dibujar, se ejecuta despues del setUp 
function draw() {
  
}

function iniciar(canvas,inicio, fin, tableId, path, grid, tableAccionesId, isTomar){
  console.log("Iniciando canvas");
  //Colocamos el fondo del canvas
  canvas.background(c_fondo);
  
  // Inicializamos las listas de abierto y cerrada
  var openSet = [];
  var closedSet = [];
  
  //Agregamos el inicio a la lista openSet
  openSet.push(inicio);
  
  //Asignamos valor actual
  var actual = inicio;
  var iteracion = 0;

  //Mientras haya valores en la lista openSet ejecutar algoritmo A*
  while(openSet.length > 0){
    iteracion++;
    //Buscando la mejor opcion
    var ganador = 0;
    for (var i = 0; i < openSet.length; i++) {
      if (openSet[i].f < openSet[ganador].f) {
        ganador = i;
      }
    }
    actual = openSet[ganador];

    //Se valida si ha llegado a la meta
    if (actual.i == fin.i && actual.j == fin.j)    {
      console.log('Meta!');//ha llegado a la meta
      break;
    }

    // Mejor opcion se mueve de openSet a closeSet
    removeFromArray(openSet, actual);
    closedSet.push(actual);

    // Se revisan los cuadrantes vecinos
    var vecinos = actual.vecinos;
    for (var i = 0; i < vecinos.length; i++) {
      var neighbor = vecinos[i];

      // Validamos vecinos
      if (!closedSet.includes(neighbor) && !neighbor.muro) {
        var tempG = actual.g + heuristic(neighbor, actual);
        // Se revisa si el camino actual es mejor que el anterior
        var newPath = false;
        if (openSet.includes(neighbor)) {
          if (tempG < neighbor.g) {
            neighbor.g = tempG;
            newPath = true;
          }
        } else {
          neighbor.g = tempG;
          newPath = true;
          openSet.push(neighbor);
        }

        //Si se encuentra mejor path se agrega
        if (newPath) {
          neighbor.h = heuristic(neighbor, fin);
          neighbor.f = neighbor.g + neighbor.h;
          neighbor.previous = actual;
        }
      }
    }

    //Obtenemos el path hasta el momento
    path = [];
    var temp = actual;
    path.push(temp);

    //Iteramos sobre cada lugar para identificar el valor previo empezando por el ultimo
    while (temp.previous) {
      path.push(temp.previous);
      temp = temp.previous;
    }
    path = path.reverse();
    
    //Impirmir resusltados
    generate_table(tableId, iteracion, closedSet, openSet, path);
  }

  //Validadr si tuvo solucion
  if(openSet.length == 0){
    alert('No hay solucion');
  }else{
    //Dibujar proceso
    draw_proceso(canvas, closedSet, openSet, actual, grid, path, inicio, fin);

    //Tabla de acciones
    generate_table_resultado(tableAccionesId, path, inicio, fin, isTomar)
  }
}

function draw_proceso(canvas, closedSet, openSet, actual, grid, path, inicio, fin){
  //Ponemos color de fondo
  canvas.background(c_fondo);

  //Pintamos celda con color de fondo
  for (var i = 0; i < cols; i++) {
    for (var j = 0; j < rows; j++) {
      grid[i][j].show(c_fondo);
    }
  }

  //Ponemos celdas de inicio y fin
  setTiempo(100, inicio, 0, c_cerrada);
  setTiempo(200, fin, 0, c_fin_2);
  
  //Color para los caminos revisados
  var t1 = 500;
  for (var i = 0; i < closedSet.length; i++) {
   setTiempo(t1, closedSet[i], i, c_cerrada);
  }
  
  //Color para los caminos abiertos
  //for (var i = 0; i < openSet.length; i++) {
  // setTiempo(1000, openSet[i], i, c_abierta);
  //}

  //Color para el camino principal
  var t2 = (t1 + (500 * closedSet.length));
  for (var i = 0; i < path.length; i++) {
    setTiempo(t2, path[i], i, c_camino);
  }
  
  //Color para meta
  var t3 = t2 + (500 * path.length);
  setTiempo(t3, fin, 0, c_fin);
  
  for (var i = 0; i < path.length; i++) {
    vertex(path[i].i * w + w / 2, path[i].j * h + h / 2);
  }
}

//Funcion que pinta sobre la celda, con un color y despues ded cierto tiempo
function setTiempo(t, valor, i, color){
    setTimeout(function() {
      valor.show(color);
    }, t + (i * 500));
}

//Inicializa valores de tabla
function initTable(idDiv){
  var table = document.getElementById(idDiv);
    //Crea encabezados
  var sHead = "<tr><th>Iteracion</th><th>Lista cerrada</th><th>Lista Abierta</th><th>Calculos</th><th>Path</th></tr>";
  table.innerHTML = sHead;
}

//Genera tabla
function generate_table(idDiv, iteracion, listaCerrada, listaAbierta, path) {
  //Obtienen elemento id
  var table = document.getElementById(idDiv);
    
  // Crea table row
  var row = document.createElement("tr");

  //Crear valor iteracion
  var cell_iteracion = document.createElement("td");
  var cellText_iteracion = document.createTextNode(iteracion);           
  cell_iteracion.appendChild(cellText_iteracion);
  row.appendChild(cell_iteracion);

  //Crear valor lista cerrada
  var cadena_lc = "";
  for (var i = 0; i < listaCerrada.length; i++){
    if(i != 0) cadena_lc += ", ";
    cadena_lc += "R(" + listaCerrada[i].i + "," + listaCerrada[i].j + ")";
  }
  var cell_lc = document.createElement("td");
  var cellText_lc = document.createTextNode(cadena_lc);           
  cell_lc.appendChild(cellText_lc);
  row.appendChild(cell_lc);
  
  //Crear valor lista abierta
  var cadena_la = "";
  for (var i = 0; i < listaAbierta.length; i++){
    if(i != 0) cadena_la += ", ";
    cadena_la += "R(" + listaAbierta[i].i + "," + listaAbierta[i].j + ")";
  }
  var cell_la = document.createElement("td");
  var cellText_la = document.createTextNode(cadena_la);           
  cell_la.appendChild(cellText_la);
  row.appendChild(cell_la);

  //Crear valor calculos
  var cell_calculo = document.createElement("td"); 
  for (var i = 0; i < listaAbierta.length; i++){
    var cadena_calculos = "F(" + listaAbierta[i].i + "," + listaAbierta[i].j + ")=" 
      + listaAbierta[i].g + " + " + listaAbierta[i].h + " = " + listaAbierta[i].f;
    var td_1 = document.createElement("p");
    var td_node = document.createTextNode(cadena_calculos);           
    td_1.appendChild(td_node);
    cell_calculo.appendChild(td_1);
  }         
  row.appendChild(cell_calculo);

  //Crea camino final
  if(iteracion != 0){
    var cadena_path = "";
    for (var i = 0; i < path.length; i++){
      if(i != 0) cadena_path += " -> ";
      cadena_path += "(" + path[i].i + "," + path[i].j + ")";
    }
    var cell_path = document.createElement("td");
    var cellText_path = document.createTextNode(cadena_path);           
    cell_path.appendChild(cellText_path);
    row.appendChild(cell_path);
  }
  
  //Agrega fila a la tabla
  table.appendChild(row);
}

//Genera tabla con las acciones a realizar
function generate_table_resultado(idDiv, path, origen, fin, isTomar) {
  //Obtiene tabla
  var table = document.getElementById(idDiv);
  var sHead = "<tr><th>Acciones</th></tr>";
  table.innerHTML = sHead;

  //Crea valores para los pasos
  for (var i = 0; i < path.length; i++){
    var textBase = "Mover";
    if(i == 0){
      if(isTomar){
        textBase = "Robot inicio";
      }else{
        textBase = "Robot con inventario inicio";
      }
    }
    
    var row = document.createElement("tr");
    var cadena_path = "";
    cadena_path += textBase + "(" + path[i].i + "," + path[i].j + ")";
    var cell_path = document.createElement("td");
    var cellText_path = document.createTextNode(cadena_path);           
    cell_path.appendChild(cellText_path);
    row.appendChild(cell_path);
    table.appendChild(row);
  }

  //Agrega valor de mover final
  var rowFinM = document.createElement("tr");
  var cellFinM = document.createElement("td");
  var cadenaFinM = "Mover: (" + fin.i + "," + fin.j + ")";
  var cellTextFinM = document.createTextNode(cadenaFinM);
  cellFinM.appendChild(cellTextFinM);
  rowFinM.appendChild(cellFinM);
  table.appendChild(rowFinM);

  //Agrega paso final
  var rowFin = document.createElement("tr");
  var cellFin = document.createElement("td");
  var cadenaFin = "";
  if(isTomar){ 
    cadenaFin = "Robot toma inventario: (" + fin.i + "," + fin.j + ")";
  }else{
    cadenaFin = "Robot deja inventario: (" + fin.i + "," + fin.j + ")";
  } 
  var cellTextFin = document.createTextNode(cadenaFin);
  cellFin.appendChild(cellTextFin);
  rowFin.appendChild(cellFin);
  table.appendChild(rowFin);
}
 
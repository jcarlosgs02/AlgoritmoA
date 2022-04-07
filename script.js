//Colores
c_muro = "#000000";
c_fondo = "#ddf1fa";
c_abierta = "#ff9780";
c_cerrada = "#90d6f5";
c_camino = "#f5f190";
c_camino_linea = "#64cb68";
c_borde = "#000000";
c_inicio = "#ffeb3b";
c_fin = "#4caf50";

// funcion para la ubicacion en la matriz
function Lugar(i, j) {
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
  
  // se inicializa la variable anterior
  this.previous = undefined;

  //Colocando los muros
  if (i == 1 && j == 1) { this.muro = true; }
  else if (i == 1 && j == 0) { this.muro = true; }

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

// Se crea el arreglo para el path
var path1a = [];
var path1b = [];

//Se crean canvas para mostrar caminos
var canvas1a;
var canvas1b;


function setup(){
  //Se crean los diferentes problemas a resolver
  setupCanvas(canvas1a, 'div_canvas_1a', grid1a, 2, 2, 0, 0, 'table_1a', path1a);
  //setupCanvas(canvas1b, 'div_canvas_1b', grid1b, 0, 0, 2, 2, 'table_1b', path1b);
}

//Seteamos datos que seran usados
function setupCanvas(canvas, divCanvas, grid, inicio_i, inicio_j, fin_i, fin_j, tableId, path) {
  canvas = createCanvas(300, 300);//Se crea un canvas
  canvas.parent(divCanvas);
  console.log('A*');//se revisa en Consola el inicio del algoritmo

  // Se crea el tamaño de las casillas
  w = canvas.width / cols;
  h = canvas.height / rows;

  // Creando el arreglo
  for (var i = 0; i < cols; i++) {
    grid[i] = new Array(rows);
  }

  //LLenamos grid con objeto Lugar
  for (var i = 0; i < cols; i++) {
    for (var j = 0; j < rows; j++) {
      grid[i][j] = new Lugar(i, j);
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
  this.iniciar(canvas, inicio, fin, tableId, path, grid);
}

//Funcion de canvas para dibujar, se ejecuta despues dedl setUp 
function draw() {
  //this.iniciar();
}

function iniciar(canvas,inicio, fin, tableId, path, grid){
  console.log("Iniciando canvas: " + canvas);
  canvas.background(c_fondo);
  
  // Inicializamos las listas de abierto y cerrada
  var openSet = [];
  var closedSet = [];
  openSet.push(inicio);
  var actual = inicio;
  var iteracion = 0;
  
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
  
    while (temp.previous) {
      path.push(temp.previous);
      temp = temp.previous;
    }
    path = path.reverse();
    
    //Impirmir resusltados
    generate_table(tableId, iteracion, closedSet, openSet, path);
  }
    //Dibujar proceso
    draw_proceso(canvas, closedSet, openSet, actual, grid, path);
}

function draw_proceso(canvas, closedSet, openSet, actual, grid, path){
  canvas.background(c_fondo);
  for (var i = 0; i < cols; i++) {
    for (var j = 0; j < rows; j++) {
      grid[i][j].show(c_fondo);
    }
  }
  
  //Color para los caminos revisados
  for (var i = 0; i < closedSet.length; i++) {
   setTiempo(1000, closedSet[i], i, c_cerrada);
  }
  
  //Color para los caminos abiertos
  //for (var i = 0; i < openSet.length; i++) {
  //  setTiempo(1000, openSet[i], i, c_abierta);
  //}

  //Color para el camino principal
  for (var i = 0; i < path.length; i++) {
    setTiempo(4000, path[i], i, c_camino);
  }
  
  for (var i = 0; i < path.length; i++) {
    vertex(path[i].i * w + w / 2, path[i].j * h + h / 2);
  }
}

function setTiempo(t, valor, i, color){
    setTimeout(function() {
      valor.show(color);
    }, t + (i * 500));
}

function generate_table(idDiv, iteracion, listaCerrada, listaAbierta, path) {
  // get the reference for the body
  var table = document.getElementById(idDiv);

    // creates a table row
    var row = document.createElement("tr");

    //Crear iteracion
    var cell_iteracion = document.createElement("td");
    var cellText_iteracion = document.createTextNode(iteracion);           
    cell_iteracion.appendChild(cellText_iteracion);
    row.appendChild(cell_iteracion);

    //Crear lista cerrada
    var cadena_lc = "";
    for (var i = 0; i < listaCerrada.length; i++){
      if(i != 0) cadena_lc += ", ";
      cadena_lc += "R(" + listaCerrada[i].i + "," + listaCerrada[i].j + ")";
    }
    var cell_lc = document.createElement("td");
    var cellText_lc = document.createTextNode(cadena_lc);           
    cell_lc.appendChild(cellText_lc);
    row.appendChild(cell_lc);
  
    //Crear lista abierta
    var cadena_la = "";
    for (var i = 0; i < listaAbierta.length; i++){
      if(i != 0) cadena_la += ", ";
      cadena_la += "R(" + listaAbierta[i].i + "," + listaAbierta[i].j + ")";
    }
    var cell_la = document.createElement("td");
    var cellText_la = document.createTextNode(cadena_la);           
    cell_la.appendChild(cellText_la);
    row.appendChild(cell_la);

    //Crear calculos
    var cadena_calculos = "";
    for (var i = 0; i < listaAbierta.length; i++){
      if(i != 0) cadena_calculos += ", ";
      cadena_calculos += "F(" + listaAbierta[i].i + "," + listaAbierta[i].j + ")=" 
        + listaAbierta[i].g + " + " + listaAbierta[i].h + " = " + listaAbierta[i].f;
    }
    var cell_calculo = document.createElement("td");
    var cellText_calculo = document.createTextNode(cadena_calculos);           
    cell_calculo.appendChild(cellText_calculo);
    row.appendChild(cell_calculo);

    //Camino final
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
  
    // add the row to the end of the table div
    table.appendChild(row);
}
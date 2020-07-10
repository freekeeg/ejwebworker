
$(document).ready(function(){
  // the "href" attribute of .modal-trigger must specify the modal ID that wants to be triggered
  $('.modal-trigger').leanModal();
  $('.modalM').click()
});


var map, infoWindow, pos, marker

if ( navigator.geolocation ) {
  navigator.geolocation.getCurrentPosition(function (position) {
    pos = {
      lat: position.coords.latitude,
      lng: position.coords.longitude
    }
    initMap()
  })
} else {
  alert('Tu Navegador no soporta la Geolocalización')
}

function initMap() {
  var mapContainer = document.getElementById('map')
  var config = {
    center: {lat: -34.397, lng: 150.644},
    zoom: 5
  }
  map = new google.maps.Map(mapContainer, config)
  infoWindow = new google.maps.InfoWindow({ map: map })
  Agenda.init() 
}

var button = document.getElementById('btn-geo')
button.addEventListener('click', function() {
  map.setCenter(pos)
  map.setZoom(15)
  // infoWindow.setPosition(pos)
  // infoWindow.setContent('Ubicación Encontrada')
  var markerOpts = {
    position: pos,
    map: map
  }
  marker = new google.maps.Marker(markerOpts)

})

// SE CAMBIAN LAS FUNCIONES PARA HACERLAS localStorage 

var Agenda = {
  init:  function(){
    this.listenMapClick()
    this.sitiosGuardados = []
    //sessionStorage.setItem('sitios', JSON.stringify(this.sitiosGuardados))
    this.loadSites()
  },
  listenMapClick: function(){

    var self = this
    google.maps.event.addListener(map, 'click', function(ev){
      var position = ev.latLng
      var modalInfo = document.getElementsByClassName('modalInfo')[0].click()
      var btnGuardar = document.getElementsByClassName('guardaInfo')[0]
      btnGuardar.onclick = function(e){
        e.preventDefault()
        /* Cancela la acción del evento. Pero por compatibilidad es mejor solo:
          event.preventDefault();*/        
        var nombre = document.getElementsByClassName('nombre')[0],
        descripcion = document.getElementsByClassName('descripcion')[0] 
        var site = {
          nombre: nombre.value,
          descripcion: descripcion.value,
          latitud: position.lat(),
          longitud: position.lng()
        }
        self.saveAndPlaceMarker(site)
        /* Para que se accione y llame a la funcion saveAndPlaceMarker y le envie los datos del sitio a guardar
        como un objeto  luego se limpia el formulario y se cierra el modal.
        En esta funcion se crea una variable self que es igual a this, es decir, al objeto Agenda.
        Esto se hace para mantener el contexto en una variable ya que this (dentro de la funcion onClick del boton)
        es igual al elemento DOM correspondiente al boton*/        
        nombre.value = '' 
        descripcion.value = ''
        $('#modalCaptura').closeModal()
      }
    })
  },
  saveAndPlaceMarker: function(site){
    if(localStorage.sitios){
      this.sitiosGuardados = JSON.parse(localStorage.getItem('sitios'))
    }
    //this.sitiosGuardados = JSON.parse(sessionStorage.getItem('sitios'))
    this.sitiosGuardados.push(site)
    localStorage.setItem('sitios',JSON.stringify(this.sitiosGuardados))
    this.renderSite(site)
  },
  /*saveAndPlaceMarker:
  Es una pequeña funcion que recibe un objeto como argumento, el cual corresponde al sitio que elegimos
  guardar en la mapa y en la agenda.
  Esta funcion guarda losdatos de sessionStorage y llama a otra funcion llamada renderSite y le envia 
  la informacion del sitio.*/


  renderSite: function(site){
    //Creacion de Web Workers
    var worker = new Worker('doHtml.js')
    //Envia datos de sitio a worker y este contruye el html
    worker.postMessage(site)
    worker.addEventListener('message',function(e){//contruye html
      //escuchador para recibir notificacion de creacion html ok
      var result = e.data      
      var allSites = document.getElementsByClassName('guardados')[0]
      var markerOpts = {
        position:{
          lat: site.latitud,
          lng: site.longitud
        },
        map:map
    }
    var newMarker = new google.maps.Marker(markerOpts)
    allSites.innerHTML = allSites.innerHTML + result    
    //Finaliza worker
    worker.terminate()
    })
  },

  loadSites:function(){ //ENCARGADA DE CARGAR LOS SITIOS CUANDO ENTREMOS NUEVAMENTE A LA PAGINA
    if (localStorage.sitios) {//consulta si existen sitios guardados
      var sitios = JSON.parse(localStorage.getItem('sitios'))//obtiene los sitios guardados y los obtiene - convierte en array
      var self = this
      /*En este caso la funcion map nativas de los array nos permite iterar y realizar determinadas acciones con
      los elemetos - como llamar la funcion renderSite y pasarle como argumento ese objeto.
       */
      sitios.map(function(site){
        self.renderSite(site)
      })
    }
  }


}



  
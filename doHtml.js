self.addEventListener("message",function(e){
    var site = e.data
    var htmlInfo = '<li class="collection-item avatar">'+
    '<i class="material-icon cicle blue"> -</i>' +
    '<span class="title">:nombre:</span>'+
    '<p>Latitud: :latitud: <br> longitud: :longitud <br> Descripcion: :descripcion:</p>'+
    '<a href="#!" class="secundary-content"><i class="material-icons">grade</i></a>'+
    '</li>';

    var newSite = htmlInfo
    var result = newSite.replace(':nombre:', site.nombre)
                        .replace(':latitud:', site.latitud)
                        .replace(':longitud:', site.longitud)
                        .replace(':descripcion:', site.descripcion)
    self.postMessage(result)
})
    
$( document ).ready(function() {
    $('#btningresar').on('click', function(e){
        e.preventDefault();
        $('section').toggleClass('muestra');
        document.getElementById("tiempo").innerText = 30;
        //setTimeout(iniciar(), 5000);
        iniciar()
      }); 
         

    
  var localDbValues = [];     // array to store db values for each loop withing the refresh_rate
  var refresh_rate = 1000;
  var color = 'green';
  var stream;
  var offset = 30;
  var average = 0;
  var date;
  var tiempo = 30;

  const jsConfetti = new JSConfetti()

function iniciar(){
    
  
  console.log(navigator.mediaDevices.getUserMedia({ audio: true, video: false }))
  
  navigator.mediaDevices.getUserMedia({ audio: true, video: false }).then((stream) => {
      
      const context = new AudioContext();
      const source = context.createMediaStreamSource(stream);
      const processor = context.createScriptProcessor(2048, 1, 1);
      const analyser = context.createAnalyser();
  
      analyser.smoothingTimeConstant = 0.8;
      analyser.fftSize = 256;
  
      source.connect(analyser);
      analyser.connect(processor);
      processor.connect(context.destination);
  
      processor.onaudioprocess = () => {
  
          var data = new Uint8Array(analyser.frequencyBinCount);
          analyser.getByteFrequencyData(data);
          var values = 0;
  
          for (var i = 0; i < data.length; i++) {
              //if (data[i]>130) data[i]=130;
              values += data[i];
          }
  
          offset = 30;
          document.getElementById("offset_value").innerText = offset;
          average = 20*Math.log10(values/data.length) + offset;
          localDbValues.push(average);
          console.log("paso del offset"+average)
          
          darAlerta(average, processor, tiempo)
      };
  })

  // update the volume every refresh_rate m.seconds
  var updateDb = function() {
      window.clearInterval(interval);
  
      const db = document.getElementById("db");
      console.log("texto"+db)
      var volume = Math.round(localDbValues.reduce((a,b) => a+b) / localDbValues.length);
      //var volume = Math.round(Math.max.apply(null, localDbValues));
      if (!isFinite(volume)) volume = 0;  // we don't want/need negative decibels in that case
      db.innerText = volume;
      localDbValues = []; // clear previous values
      changeColor(volume);
  
      //changeUpdateRate();
      interval = window.setInterval(updateDb, refresh_rate);
      document.getElementById("tiempo").innerText = tiempo;
      tiempo=tiempo-1;
    }
  var interval = window.setInterval(updateDb, refresh_rate);

}; 
  
  // change the visualization colors according to the dbValue
  function changeColor(decibels) {
      if (decibels < 30) {color = 'green'}
      else if (decibels >=30 && decibels <70) {color = 'yellow'}
      else if (decibels >= 70 && decibels <90) {color = 'orange'}
      else {color = 'red'}
  
      //document.getElementById("visuals").style.height = dbValue + "px";
      document.getElementById("visuals").style.width = decibels*2/10 + "rem";
      if (decibels>=70) document.getElementById("visuals").style.background = 'red';
      else document.getElementById("visuals").style.background = 'black';
      document.getElementById("db").style.color = color;
  }
  
  
  // change update rate
  function changeUpdateRate() {
      refresh_rate = Number(document.getElementById("refresh_rate").value);
      document.getElementById("refresh_value").innerText = refresh_rate;
      intervalId = window.setInterval(function() {
          updateDb;
      }, refresh_rate);
  }
  
  
  // update the date of last project's version
  /*
  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      let repos = JSON.parse(this.responseText);
      repos.forEach((repo)=>{
          if (repo.name == "db-meter") {
              date = new Date(repo.pushed_at);
              document.getElementById("date").innerText = date.toLocaleDateString();
          }
      });
    }
  };
  xhttp.open("GET", "https://api.github.com/users/takispig/repos", true);
  xhttp.send();
  */

  
  
  
  
});
function darAlerta(db, processor, tiempo)
{
    console.log("paso por aca"+db)
    if (db <= 30)
    {
        //$('#modalPerdedor').modal('show');
        Swal.fire({
            title: '',
            text: '',
            imageUrl: 'img/intetalo-nuevo.png',
            imageWidth: 1050,
            imageHeight: 611,
            imageAlt: 'Custom image',
          })
        processor.onaudioprocess = null;
        

    }
    if (tiempo == 0)
    
    {
        jsConfetti = new JSConfetti()
        jsConfetti.addConfetti();
        //const canvas = document.getElementById('jsConfetti')
        //const jsConfetti = new JSConfetti({ canvas })

        //$('#modalGanador').modal('show');
        Swal.fire({
            title: '',
            width: 1050,
            height: 750,
            heightAuto: true,
            padding: '18em',
            color: '#716add',
            confirmButtonColor:'#ea0002',
            confirmButtonText:'anotacion',
            background: 'rgba(0,0,0,0.0) url(img/Gooll-ok.png) no-repeat',
            backdrop: `
              rgba(0,0,0,0.8)
              url("")
              left top
              no-repeat
            `
          })

        //var myInput = document.getElementById('myInput')
        processor.onaudioprocess = null;

    }
}



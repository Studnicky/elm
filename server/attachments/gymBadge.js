// https://qplanner.co.uk/tmp/pkmngo/

var imgPreview,imgC,imgCTX,badgeCols=[["Basic",500,[220,220,220]],["Bronze",3500,[236,200,172]],["Silver",26E3,[185,213,223]],["Gold",0,[255,212,88]]],results;

onload=function(){
  results=document.getElementById("results");
  imgPreview=document.getElementById("imgPreview");
  imgC=document.createElement("canvas");
  imgCTX=imgC.getContext("2d",{
    alpha:!1
  }
  )};



  function loadNewImage(){

    var c=document.getElementById("imgPicker").files;

    if(FileReader&&c&&c.length){

      var a=new FileReader;

      a.onload=function() {
        "data:image/jpeg;"==a.result.substr(0,16)?setResult("JPEG screenshots are not supported at this time, sorry.","Try a different image."):(imgPreview.onload=function(){
          setTimeout(250,appraiseImage())
        },
        imgPreview.src=a.result,imgPreview.setAttribute("data-show",""))};

        a.readAsDataURL(c[0])}
      }



      function appraiseImage(){
        imgC.width=imgPreview.naturalWidth;
        imgC.height=imgPreview.naturalHeight;

        imgCTX.drawImage(imgPreview,0,0,imgPreview.naturalWidth,imgPreview.naturalHeight);

        var c=getBadgeColour();

        if(-1==c) {
          setResult("Couldn't work out your badge level.","Try a different image.");
        } else if(3==c) {
          setResult("That's a lovely gold badge you have, well done.","");
        } else {
          var a=findY();
          if(a)
          {
            if(a=getWidthAndPosition(a)){
            var e=Number(a[1]/a[0]).toFixed(2),b=badgeCols[c][1]-Math.round(a[1]/a[0]*badgeCols[c][1]),
            g=document.createDocumentFragment(),d=document.createElement("h4");

            d.textContent="Here's a few ways you can level your badge up";

            g.appendChild(d);

            var f=Math.ceil(b/1E3);

            d=document.createElement("div");

            d.textContent="Complete "+f+" raid"+(1!==f?"s":"");

            g.appendChild(d);

            d=document.createElement("div");

            d.textContent="Place "+Math.ceil(b/100)+" Pok\u00e9mon in this gym";

            g.appendChild(d);

            f=Math.ceil(b/60);

            d=Math.floor(f/24);

            f-=24*d;

            d=0<d?d+" day"+(1!==d?"s":""):!1;

            var h=0<f?f+" hour"+(1!==f?"s":""):!1;

            f=[];
            d&&f.push(d);
            h&&f.push(h);
            d=document.createElement("div");
            d.textContent="Have a Pok\u00e9mon in the gym for "+f.join(", ");
            g.appendChild(d);
            f=Math.ceil(b/15);
            d=document.createElement("div");
            d.textContent="Defeat "+f+" 1500CP Pok\u00e9mon in this gym";
            g.appendChild(d);
            f=Math.ceil(b/10);
            d=document.createElement("div");
            d.textContent="Feed Pok\u00e9mon in this gym "+f+(1!==f?" berries!":" berry");
            g.appendChild(d);
            setResult(badgeCols[c][0]+" badge at ~"+100*e+"%","You need about "+b+" more EXP ("+

            String.fromCharCode(177)+Math.round(1/a[0]*badgeCols[c][1])+")");
            results.children[3].appendChild(g)}
            else setResult("Failed to find a progress bar.","Try a different image.");
            else setResult("Failed to find a progress bar.","Try a different image.")}
          }
          function setResult(c,a){
            results.children[0].textContent=c||"";
            for(results.children[2].textContent=a||"";
            results.children[3].firstChild;
          )results.children[3].removeChild(results.children[3].firstChild)}


          function findY(){
            for(var c=imgCTX.getImageData(Math.round(imgPreview.naturalWidth/2),0,1,imgPreview.naturalHeight).data,a=[0,0,0],e=0,b=0;
            b<imgPreview.naturalHeight;
            b++){
              if(21!=c[4*b]&&232!=c[4*b+1]){
                if(4<=e&&(232==a[0]&232==a[1]&232==a[2]||21==a[0]&232==a[1]&219==a[2]))return b-1-Math.round(e/2);
                e=0}
                else if(c[4*b]==a[0]&&c[4*b+1]==a[1]&&c[4*b+2]==a[2])0==e&&(e=1),e++;
                else{
                  if(4<=e&&(232==a[0]&232==a[1]&232==a[2]||21==a[0]&232==a[1]&219==a[2]))return b-1-Math.round(e/2);
                  e=0}
                  a=c.slice(4*b,4*b+3)}
                  return!1}


                  function getWidthAndPosition(c){
                    c=imgCTX.getImageData(0,c,imgPreview.naturalWidth,1).data;
                    for(var a=0,e=0,b=0;
                      b<imgPreview.naturalWidth;
                      b++)if(232!=c[4*b+1]){
                        if(50<a)return[a,Math.max(0,e-b+a)]}
                        else 232==c[4*b+1]&&21<=c[4*b]&&40>c[4*b]&&(e=b),a++,c.slice(4*b,4*b+3);
                        return!1
                      }



                        function getBadgeColour(){
                          for(var c=imgCTX.getImageData(Math.round(imgPreview.naturalWidth/2),0,1,imgPreview.naturalHeight).data,a=-1,e=0,b=imgPreview.naturalHeight-1;
                          0<b;
                          b--)for(var g=0;
                            4>g;
                            g++)if(c[4*b]==badgeCols[g][2][0]&&c[4*b+1]==badgeCols[g][2][1]&&c[4*b+2]==badgeCols[g][2][2]){
                              if(25<=e)return a;
                              a==g?(a=g,e++):(e=1,a=g)}
                              return-1
                            };

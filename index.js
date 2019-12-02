function calcularClick(evento) {
    // nao atualizar a pagina
    evento.preventDefault();
    
    var cAB = parseFloat(document.getElementById("cAB").value);
    var cBC = parseFloat(document.getElementById("cBC").value);     // variaveis de carga
    var dAB = parseFloat(document.getElementById("dAB").value);
    var dBC = parseFloat(document.getElementById("dBC").value);     // variaveis de distancia

    console.log(cAB,cBC,dAB,dBC);

        //coeficiente das cargas caso 0
        var qAB = -cAB* (Math.pow(dAB,2))/8;
    console.log("COEFICIENTE CARGA AB: ",qAB);
        var qBC = cBC* (Math.pow(dBC,2))/8;
    console.log("COEFICIENTE CARGA BC: ",qBC);

        //coeficiente de rotação caso 1
        var EI = parseFloat(document.getElementById("vEI").value);
        console.log("valor ei", EI);
        var qEI_AB = (3*EI)/dAB;
        var qEI_BC = (3*EI)/dBC;
        console.log("coeficiente rotacao AB: ",qEI_AB);
        console.log("coeficiente rotacao BC: ",qEI_BC);
        
        //equilíbrio
        var teta = -((qAB+qBC)/(qEI_AB+qEI_BC));
        console.log("teta da rotacao: " , teta);

        //momentos
        var M_a = 0;
        var M_bes = qAB+(qEI_AB*teta);
        var M_bdi = qBC+(qEI_BC*teta);
        var M_c = 0;
        console.log("momentos B ESQUERDA: ", M_bes);
        console.log("momentos B DIREITA: ", M_bdi); //ate aqui tudo certo

        //DEC somatorio das forças
        var Ay = ((cAB*dAB*(dAB/2))+M_bes)/dAB;
        var Cy = ((cBC*dBC*(dBC/2))-M_bdi)/dBC;
        var By = -(Ay)-(Cy)+(dAB*cAB)+(cBC*dBC);

        console.log(Ay,Cy,By)

        // DEC -> nova distancia ab
        var Nwab = Math.abs((cAB*dAB)-Ay);                  //valor valor triangulo maior ab
        var Nwb = By-Nwab;     //B descendo                  // valor no b

        var Nwc = Math.abs(Nwb - (cBC * dBC));              //valor ponto c
        
        var Pab = (Ay*dAB)/(Ay+Nwab);                       //semelhanças
        var Pbc = (Nwb*dBC)/(Nwb+Nwc);
                
        console.log(Pab,Pbc)

        //momentos maximos
        var Novod1 = Pab;
        var Novoc = dBC-Pbc;
        var M1 = (Ay*Novod1)-(cAB*Novod1*(Novod1/2));
        var M2 = (Cy*Novoc)-(cBC*Novoc*(Novoc/2));

        console.log(M1,M2,Novoc)   

        //chamadas de funçao
    calculaTamanhoCargas(cAB, cBC);
    
    mostrarElementos();
    alterarValores(cAB,cBC,dAB,dBC);
    montarDMF(M1.toFixed(2), M2.toFixed(2), M_bes.toFixed(2), M_bdi.toFixed(2));
    montarDEC(Ay.toFixed(2), Nwb.toFixed(2), Nwab.toFixed(2), Cy.toFixed(2));
}

function calculaTamanhoCargas(carga1, carga2) {
    if(carga1 > carga2) {
        var cargaEsq = document.getElementById("carga-esq");
        cargaEsq.style.top = "-51px";
        cargaEsq.style.height = "70px";

        var cargaDir = document.getElementById("carga-dir");
        cargaDir.style.top = "-31px";
        cargaDir.style.height = "50px";
        
    } else if(carga1 < carga2){
        var cargaDir = document.getElementById("carga-dir");
        cargaDir.style.top = "-51px";
        cargaDir.style.height = "70px";

        var cargaEsq = document.getElementById("carga-esq");
        cargaEsq.style.top = "-31px";
        cargaEsq.style.height = "50px";
    } else {
        var cargaDir = document.getElementById("carga-dir");
        cargaDir.style.top = "-31px";
        cargaDir.style.height = "50px";

        var cargaEsq = document.getElementById("carga-esq");
        cargaEsq.style.top = "-31px";
        cargaEsq.style.height = "50px";
    }
}


function mostrarElementos() {
    document.getElementById("carga-esq").style.visibility="visible";
    document.getElementById("carga-dir").style.visibility="visible";
    document.getElementById("valor-carga1").style.visibility="visible";
    document.getElementById("valor-carga2").style.visibility="visible";
    document.getElementById("distancia-viga1").style.visibility="visible";
    document.getElementById("distancia-viga2").style.visibility="visible";
    document.getElementById("dmf").style.visibility="visible";
}

function alterarValores(karga1,karga2,dist1,dist2) {
    document.getElementById("valor-carga1").innerHTML = karga1+" KN/m";
    document.getElementById("valor-carga2").innerHTML = karga2+" KN/m";
    document.getElementById("distancia-viga1").innerHTML = dist1+" m";
    document.getElementById("distancia-viga2").innerHTML = dist2+" m";
}

function montarDMF(maximo1, maximo2, maximob1, maximob2) {
    document.getElementById("maximo1").innerHTML = maximo1+" KN.m";
    document.getElementById("maximo2").innerHTML = maximo2+" KN.m";
    document.getElementById("maximo-b1").innerHTML = maximob1+" KN.m";
    document.getElementById("maximo-b2").innerHTML = maximob2+" KN.m";

    if(parseFloat(maximo1) > parseFloat(maximo2) ) {
        document.getElementById("curva1").setAttribute("d", "M 45 200 Q 180,400 270,100");
        document.getElementById("curva2").setAttribute("d", "M 270 100 Q 390,350 500,200");
    } else if(parseFloat(maximo2) > parseFloat(maximo1)) {
        document.getElementById("curva1").setAttribute("d", "M 45 200 Q 180,350 270,100");
        document.getElementById("curva2").setAttribute("d", "M 270 100 Q 390,400 500,200");
    } else {
        document.getElementById("curva1").setAttribute("d", "M 45 200 Q 180,400 270,100");
        document.getElementById("curva2").setAttribute("d", "M 270 100 Q 390,400 500,200");
    }
}

function montarDEC(ay, descidaB,  subidaB, cy) {
    document.getElementById("valor-dec1").innerHTML = ay;
    numero_ay = parseFloat(ay);
    numero_subidaB = parseFloat(subidaB);
    numero_cy = parseFloat(cy);
    numero_descidaB = parseFloat(descidaB);
    if(numero_ay > 0) {
        if(numero_ay < numero_descidaB) {
            document.getElementById("linha-1")
            .setAttribute("y1", 150);
            document.getElementById("linha-2").
            setAttribute("y1", 150);
        } 
    } else {
        document.getElementById("linha-1")
        .setAttribute("y1", 240);
        document.getElementById("linha-2")
        .setAttribute("y1", 240);
    }



    if(numero_cy > 0) {
    
        if(numero_cy <  numero_subidaB ) {
            document.getElementById("linha-4")
            .setAttribute("y2", 245);   
            document.getElementById("linha-5")
            .setAttribute("y1",245);
            document.getElementById("linha-3")
            .setAttribute("y2", 300);
            document.getElementById("linha-2")
            .setAttribute("y2", 300);
        } else {
            document.getElementById("linha-4")
            .setAttribute("y2", 300);
            document.getElementById("linha-5")
            .setAttribute("y1",300);
            document.getElementById("linha-3")
            .setAttribute("y2", 245);
            document.getElementById("linha-2")
            .setAttribute("y2", 245);
        }

    } else {
        document.getElementById("linha-4")
        .setAttribute("y2", 150);
        document.getElementById("linha-5")
        .setAttribute("y1", 150);
    }


    document.getElementById("valor-dec2").innerHTML = descidaB;
    document.getElementById("valor-dec3").innerHTML = subidaB;
    document.getElementById("valor-dec4").innerHTML = cy;
    document.getElementById("dec").style.visibility = "visible";
}
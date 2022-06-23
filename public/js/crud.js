var main = document.getElementsByTagName('main')[0];
var btnListar = document.getElementById('btnListar');
var btnViagem = document.getElementById('btnViagens');

function criarLista(viagens){
    const lista = document.createElement('ul');
    for (const viagem of viagens) {
        const item = document.createElement('li');
        item.innerText = viagem.nome + "   " + viagem.cpf + "   " +  viagem.endereco + "   " + viagem.email;   
        lista.appendChild(item);                                     
    }
    main.appendChild(lista);
}

function gerarLista(url){
    fetch(url)
    .then((resposta)=> {
        return resposta.json();
    })
    .then((json)=>{
        criarLista(json);
    })
}

function enviar(viagem, url, method, json){
    fetch(url, {
        method: method,
        body: JSON.stringify(json),
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }
    })
    .then(()=> {
        gerarTabela('http://localhost:3000/viagens');
    });
}

function carregarHtml(url, elemento, viagem){
    fetch(url)
    .then((resposta)=> {
        return resposta.text();
    })
    .then((html)=>{
        elemento.innerHTML = html;
    })
    .then(()=>{
        var txtNome = document.getElementById('nome');
        var txtCpf = document.getElementById('cpf');
        var txtEndereco = document.getElementById('endereco');
        var txtEmail = document.getElementById('email');



        if (viagem != null){
            txtNome.value = viagem.nome;
            txtCpf.value = viagem.cpf;
            txtEndereco.value = viagem.endereco;
            txtEmail.value = viagem.email;
        }

        var btnSalvar = document.getElementById('btnSalvar');
        btnSalvar.onclick = ()=>{

            var txtNome = document.getElementById('nome');
            var txtCpf = document.getElementById('cpf');
            var txtEndereco = document.getElementById('endereco');
            var txtEmail = document.getElementById('email');

            var nomeForm = txtNome.value;
            var descCpf = txtCpf.value;
            var descEndereco = txtEndereco.value;
            var descEmail = txtEmail.value;

            var json = {
                "nome": nomeForm,
                "cpf": descCpf,
                "endereco": descEndereco,
                "email": descEmail
            }

            var url = 'http://localhost:3000/viagens'

            if (viagem != null){
              enviar(viagem, url + '/' + viagem.id, 'PUT', json);                
            } else {
               enviar(viagem, url, 'POST', json);                
            }
        }

        var btnVoltar = document.getElementById('btnVoltar');
        btnVoltar.onclick = ()=>{
            gerarTabela('http://localhost:3000/viagens');
        };

    });
}

function configurarForm(produto){
    carregarHtml('html/form.html', main, produto);
}

var listaDeViagens; 

function gerarTabela(url){
    main.innerHTML = '';

    var btnIncluir = document.createElement('button');
    btnIncluir.innerText = "ADICIONAR";
    btnIncluir.onclick = ()=> {
        configurarForm();
    }

    main.appendChild(btnIncluir);

    fetch(url)
    .then((resposta)=> {
        return resposta.json();
    })
    .then((viagens)=>{
        listaDeViagens = viagens;

        //Tabela
        var table = document.createElement('table');
        var tbody = document.createElement('tbody');
        
        var qtdeLinhas = viagens.length;

        for(var i = 0; i < qtdeLinhas; i++){
            var viagem = viagens[i];
            var tr = document.createElement('tr');

            //1a coluna
            var td = document.createElement('td');
            var txt = document.createTextNode(viagem.id);            
            td.appendChild(txt);
            tr.appendChild(td);

            //2a coluna
            var td = document.createElement('td');
            var txt = document.createTextNode(viagem.nome);            
            td.appendChild(txt);
            tr.appendChild(td);

            //3a coluna
            var td = document.createElement('td');
            var txt = document.createTextNode(viagem.cpf);            
            td.appendChild(txt);
            tr.appendChild(td);

            //4a coluna
            var td = document.createElement('td');
            var txt = document.createTextNode(viagem.endereco);            
            td.appendChild(txt);
            tr.appendChild(td);

            //5a coluna
            var td = document.createElement('td');
            var txt = document.createTextNode(viagem.email);            
            td.appendChild(txt);
            tr.appendChild(td);

            //6a coluna
            var td = document.createElement('td');

            //Link editar
            var linkEditar = document.createElement('a');
            linkEditar.href = '#' + viagem.id;
            linkEditar.setAttribute("id", viagem.id);
            var txt = document.createTextNode('Editar');
            linkEditar.appendChild(txt);            
            linkEditar.onclick = (event)=> {
                var id = event.target.id;               
                var viagem = listaDeViagens.find(viagem => viagem.id == id);      
                configurarForm(viagem);
            }
            td.appendChild(linkEditar);

            //Link excluir
            var linkExcluir = document.createElement('a');
            linkExcluir.href = '#' + viagem.id;
            linkExcluir.setAttribute("id", viagem.id);
            var txt = document.createTextNode('Excluir');            
            linkExcluir.appendChild(txt);            
            linkExcluir.onclick = (event)=> {
                if (confirm('Tem certeza que deseja adiar a sua entrega?')) {
                    fetch('http://localhost:3000/viagens/' + event.target.id, {
                        method: "DELETE"                        
                    })
                    .then(()=> {
                        gerarTabela('http://localhost:3000/viagens');
                    });
                }
            }
            td.appendChild(linkExcluir);

            tr.appendChild(td);            
            tbody.appendChild(tr);
            
        }

        table.appendChild(tbody);

        
        main.appendChild(table);        

    })
}


function carregarImagem(url){
    fetch(url)
    .then((resposta)=> {
        return resposta.blob();
    })
    .then((imgCarregada)=>{
        var imgElemento = document.createElement('img');
        imgElemento.src = URL.createObjectURL(imgCarregada);
        main.appendChild(imgElemento);
    })
}


btnListar.onclick = ()=>{     
    main.innerHTML = '';      
    gerarLista('http://localhost:3000/viagens');
}

btnViagem.onclick = ()=>{
    main.innerHTML = '';
    gerarTabela('http://localhost:3000/viagens');
}


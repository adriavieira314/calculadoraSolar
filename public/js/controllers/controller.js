var app = angular.module('CalculadoraSolar', ['ui.utils.masks']);

app.controller('Calculadora', ['$scope', '$http', function($scope, $http) {
    const today = new Date();
    const monName = new Array ("JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC");
	$scope.inputCEP = "";
	$scope.inputValor = "";
    $scope.cdInput = "cep";
    $scope.mascara = "0000-000";
    $scope.energiaText = "";
    $scope.areaText = "";
    $scope.paineisText = "";
    $scope.potPicoText = "";
    $scope.grupo = "Grupo";
    $scope.cepInformado = false;
    $scope.valorInformado = false;
    $scope.estruturaInformada = false;
    $scope.potPainel = 410/1000;
    $scope.carregando = true;
    var caminhoXML = "../../assets/xml/79443.xml";
    var preco = [];
    // $scope.topTres = [];
    $scope.precoKit = 0;
    $scope.unico = false;
    $scope.topTres = [
        {
            codigo:  '82216-3',
            foto: 'https://www.aldo.com.br/OldSite/images/080737_151020140509.jpg',
            categoria: 'GERADOR DE ENERGIA SOLAR GROWATT METALICA PERFIL 55CM ROMAGNOLE',
            marca: 'ALDO SOLAR ON GRID',
            descricao: 'GERADOR DE ENERGIA SOLAR GROWATT METALICA PERFIL 55CM ROMAGNOLE GROWATT GEF 1,23KWP TRINA MONO PERC HALF CELL 410W MIC 1KW 1MPPT MONO 220V',
            precoeup: "6.299,00"
        },
        {
            codigo:  '83778-0',
            foto: 'https://www.aldo.com.br/OldSite/images/080737_151020140509.jpg',
            categoria: 'GERADOR DE ENERGIA SOLAR GROWATT METALICA TRAPEZOIDAL ROMAGNOLE',
            marca: 'ALDO SOLAR ON GRID',
            descricao: 'GERADOR DE ENERGIA SOLAR GROWATT METALICA TRAPEZOIDAL ROMAGNOLE GROWATT GEF 1,23KWP TRINA MONO PERC HALF CELL 410W MIC 1KW 1MPPT MONO 220V',
            precoeup: "6.369,00"
        },
        {
            codigo:  '85279-6',
            foto: 'https://www.aldo.com.br/OldSite/images/080737_151020140509.jpg',
            categoria: 'GERADOR DE ENERGIA SOLAR GROWATT METALICA TRAPEZOIDAL K2 SYSTEMS',
            marca: 'ALDO SOLAR ON GRID',
            descricao: 'GERADOR DE ENERGIA SOLAR GROWATT METALICA TRAPEZOIDAL K2 SYSTEMS GROWATT GEF 1,23KWP TRINA MONO PERC HALF CELL 410W MIC 1KW 1MPPT MONO 220V',
            precoeup: "7.969,00"
        },
    ];

    // listas para os selects
    $scope.energiaOuValor = [
        {id: 1, titulo: "Consumo (kWh)"},
        {id: 2, titulo: "Valor em Reais"}
    ]

    $scope.potenciaPainel = [
        {id: 1, potencia: "335W"},
        {id: 2, potencia: "410W"},
        {id: 3, potencia: "440W"}
    ]

    $scope.estruturas = [
        {id: 1, nome: "Metálica"},
        {id: 2, nome: "Colonial"},
        {id: 3, nome: "Laje"},
        {id: 4, nome: "Solo"},
        {id: 5, nome: "Fibrocimento"}
    ]
    
    $scope.cep = function() {
        $scope.mascara = "0000-000";
        $scope.cdInput = "cep";
    }

    // funcoes para quando o select mudar
    $scope.valor = function() {
        if ($scope.selectedValor.id === 1) {
            $scope.cdInput = "kwh";
            $scope.mascara = "Consumo (kWh)";
            $scope.inputValor = "";

        } else {
            $scope.cdInput = "reais";
            $scope.inputValor = "";
            $scope.mascara = "R$";
        }
    }

    var valorPainel = $scope.potenciaPainel[1].potencia;
    $scope.painel = function() {
        if ($scope.selectedPotPainel.id === 1) {
            $scope.potPainel = 335/1000;
            valorPainel = $scope.potenciaPainel[0].potencia;

        } else if ($scope.selectedPotPainel.id === 2) {
            $scope.potPainel = 410/1000;
            valorPainel = $scope.potenciaPainel[1].potencia;

        } else {
            $scope.potPainel = 440/1000;
            valorPainel = $scope.potenciaPainel[2].potencia;
        }
    }

    var pegaEstrutura = $scope.estruturas[0].nome;
    var valorEstrutura = pegaEstrutura.normalize("NFD").replace(/[\u0300-\u036f]/g, '').toUpperCase();
    $scope.estrutura = function() {
        if ($scope.selectedEstrutura.id === 1) {
            pegaEstrutura = $scope.estruturas[0].nome;
            valorEstrutura = pegaEstrutura.normalize("NFD").replace(/[\u0300-\u036f]/g, '').toUpperCase();

        } else if ($scope.selectedEstrutura.id === 2) {
            pegaEstrutura = $scope.estruturas[1].nome;
            valorEstrutura = pegaEstrutura.normalize("NFD").replace(/[\u0300-\u036f]/g, '').toUpperCase();

        } else if ($scope.selectedEstrutura.id === 3) {
            pegaEstrutura = $scope.estruturas[2].nome;
            valorEstrutura = pegaEstrutura.normalize("NFD").replace(/[\u0300-\u036f]/g, '').toUpperCase();

        } else if ($scope.selectedEstrutura.id === 4) {
            pegaEstrutura = $scope.estruturas[3].nome;
            valorEstrutura = pegaEstrutura.normalize("NFD").replace(/[\u0300-\u036f]/g, '').toUpperCase();

        } else {
            //o tipo de estrutura para telha fibrocimento é parafuso estrutural na Aldo
            pegaEstrutura = 'parafuso';
            valorEstrutura = pegaEstrutura.normalize("NFD").replace(/[\u0300-\u036f]/g, '').toUpperCase();
        }
    }
    //fim
    

    $scope.resultado = function() {
        calculoEnergia($scope.selectedValor.id);
        calculoPotenciaPico();
        calculoQtdPaineis();
        calculoArea();

        $scope.carregando = true;
        $scope.cdInput = "carregando";
        pronto();
        
        $scope.energiaText = $scope.energia;
        $scope.potPicoText = $scope.potPico;
        $scope.paineisText = $scope.paineis; 
        $scope.areaText = $scope.area;
        // getXML();
    }

    $scope.apagar = function() {
        $scope.topTres = [];
        preco = [];
        $scope.carregando = true;
        $scope.precoKit = 0;

        $scope.selectedValor = $scope.energiaOuValor[1].titulo;
        $scope.selectedPotPainel = $scope.potenciaPainel[1].potencia;
        $scope.selectedEstrutura = $scope.estruturas[0].nome;
        valorPainel = $scope.selectedPotPainel;
        pegaEstrutura = $scope.selectedEstrutura;
        valorEstrutura = pegaEstrutura.normalize("NFD").replace(/[\u0300-\u036f]/g, '').toUpperCase();

        $scope.cdInput = "cep";
        $scope.mascara = "0000-000";
        $scope.inputCEP = "";

        $("#cidade").val("Cidade");
        $("#uf").val("Estado");
        $scope.energiaText = "";
        $scope.energia = "";
        $scope.potPicoText = "";
        $scope.potPico = "";
        $scope.paineisText = "";
        $scope.paineis = ""; 
        $scope.areaText = "";

        $scope.area = "";
        $scope.inputValor = "";
        $scope.grupo = "Grupo";
        $scope.investimento = "";
        $scope.cepInformado = false;
    }

    calculoEnergia = function(id) {
        if ($scope.selectedValor.id === 1) {
            $scope.energia = $scope.inputValor;
        } else {
            var energia = $scope.inputValor/0.92;
            $scope.energia = Math.floor(energia);
        }
    }
    
    calculoPotenciaPico = function() {
        $scope.potPico = $scope.energia/(30 * $scope.irradiacaoSolar * 0.80);
    }

    calculoQtdPaineis = function() {
        var painel = $scope.potPico/$scope.potPainel;
        $scope.paineis = Math.floor(painel);
        if ($scope.paineis %  2 === 1) {
            $scope.paineis++;
        }

        if ($scope.paineis === 0) {
            $scope.paineis += 2;
        }
    }

    calculoArea = function() {
        $scope.area = 2.03 * $scope.paineis;
    }

    grupo = function() {
        if ($scope.potPico < 104) {
            $('#modalGrupoA').modal('show');
            texto = "Sugerimos que você seja cliente do Grupo A, entre em contato com a engenharia.";
            $(".modal-body").html("");
			$(".modal-body").append('<p style="margin-left: 20px; font-size: 15px; font-weight: bold;">' + texto + '</p>');
            $scope.grupo = "Grupo A";
        } else {
            $scope.cdInput = "grupo";
            $scope.grupo = "Grupo B";
        }
    }

   valorInvestimento = function() {
       var number = 0;
        if ($scope.potPico > 0 && $scope.potPico < 20) {
            number = 2.000 + 4.346 + $scope.precoKit;
            $scope.investimento = parseFloat(number.toFixed(3));

        }
        if ($scope.potPico >= 20 && $scope.potPico < 25) {
            number = 2.000 + 8.406 + $scope.precoKit;
            $scope.investimento = parseFloat(number.toFixed(3));

        }
        if ($scope.potPico >= 25 && $scope.potPico < 35) {
            number = 2.500 + 10.098 + $scope.precoKit;
            $scope.investimento = parseFloat(number.toFixed(3));

        }
        if ($scope.potPico >= 35 && $scope.potPico < 46) {
            number = 2.500 + 12.337 + $scope.precoKit;
            $scope.investimento = parseFloat(number.toFixed(3));

        }
        if ($scope.potPico >= 46 && $scope.potPico < 57) {
            number = 3.500 + 14.670 + $scope.precoKit;
            $scope.investimento = parseFloat(number.toFixed(3));

        }
        if ($scope.potPico >= 57 && $scope.potPico < 88) {
            number = 4.000 + 18.090 + $scope.precoKit;
            $scope.investimento = parseFloat(number.toFixed(3));

        }
        if ($scope.potPico >= 88 && $scope.potPico < 104) {
            number = 4.500 + 23.588 + $scope.precoKit;
            $scope.investimento = parseFloat(number.toFixed(3));
        }
    }

    // * busca pelo CEP pelo site viaCEP
    //Quando o campo cep perde o foco.
    $scope.encontraCEP = function() {
        //Verifica se campo cep possui valor informado.
        if ($scope.inputCEP !== "") {
            //Expressão regular para validar o CEP.
            var validacep = /^[0-9]{8}$/;
            $scope.cepInformado = true;
            $scope.cdInput = "reais";
            $scope.inputValor = "";
            $scope.mascara = "R$";

            //Valida o formato do CEP.
            if(validacep.test($scope.inputCEP)) {
                //Preenche os campos com "..." enquanto consulta webservice.
                // $scope.cepInformado = true;
                $("#cidade").val("...");
                $("#uf").val("...");

                //Consulta o webservice viacep.com.br/
                $.getJSON("https://viacep.com.br/ws/"+ $scope.inputCEP +"/json/?callback=?", function(dados) {
                }).done(function(dados) {
                    if (!("erro" in dados)) {
                        //Atualiza os campos com os valores da consulta.                        
                        $("#cidade").val(dados.localidade);
                        $("#uf").val(dados.uf);
                        
                        buscaIrradiacao(dados.localidade);
                    } else {
                        //CEP pesquisado não foi encontrado.
                        $scope.cepInformado = false;
                        $scope.$apply(function(){
                            $scope.apagar();
                        });
                        alert("CEP não encontrado.");
                    }
                })
                .fail(function(error) {
                    console.log( "error" + error );
                    alert('Erro ao buscar CEP')
                });
            } //end if.
            else {
                //cep é inválido.
                alert("Formato de CEP inválido.");
            }
        } //end if.
    }
    

    buscaIrradiacao = function(localidade) {
        $.getJSON("../../assets/json/dadosIrradiacao.json", function(dados) {
        }).done(function(dados) {
            //codigo que retira o acento e outros caracteres especiais
            var local = localidade.normalize("NFD").replace(/[\u0300-\u036f]/g, '');
            var mes = monName[today.getMonth()];

            for (let index = 0; index < dados.length; index++) {
                if (dados[index].name === local) {
                    $scope.irradiacaoSolar = dados[index][mes];
                }
            }
        })
        .fail(function(error) {
            alert("Erro ao carregar os dados da Irradiação");
            console.error(error)
        });
    }
    
    //Para dispostivos moveis
    $(document).ready(function(){
        var tam = $(window).width();
      
        if (tam <= 770){
            $scope.$apply(function(){
                $scope.unico = true;
            });

            $("#btn-apagar").removeClass("col");
            $("#btn-apagar").addClass("col-3");
        }
    });

    

    //* Codigo pegando dados do arquivo xml
    getXML = function() {
        $scope.topTres = [];
        preco = [];

        $http.get(caminhoXML, { 
            transformResponse: function (cnv) {
                var x2js = new X2JS();
                var aftCnv = x2js.xml_str2json(cnv); //transformando em json
                return aftCnv;
            }
        })
        .success(function (response) {
            for (let index = 0; index < response.produtos.produto.length; index++) {
                if (response.produtos.produto[index].atributos) { //verificando se possui a tag atributo
                    if (response.produtos.produto[index].atributos.MARCA_PAINEL) { //verificando se possui a tag marca_painel dentro da tag atributo
                        var string = response.produtos.produto[index].atributos.MARCA_PAINEL; //se sim, pegando a marca
                        var painel = string.split(" ");//transformando a string em array
    
                        if (painel.includes(valorPainel)) { //verificando se o array possui tal painel
                            //puxando a estrutura dos produtos de potencia painel de 335W/410W/440W
                            var tipo = response.produtos.produto[index].atributos.TIPO_ESTRUTURA;
                            var estrutura = tipo.split(" ");
    
                            if (estrutura.includes(valorEstrutura)) {
                                //se o produto de estrutura colonial obtiver o atributo TENSAO_SAIDA
                                if (response.produtos.produto[index].atributos.TENSAO_SAIDA) { 
                                    //pegando a tensao do produto e tirando o V de volt deixando somente as strings de numeros e convertendo-os
                                    var stringTensao = response.produtos.produto[index].atributos.TENSAO_SAIDA;
                                    var string = stringTensao.slice(0, 3);
                                    var tensao = parseInt(string);

                                    if (tensao <= 220) {
                                        preco.push(response.produtos.produto[index].precoeup);
                                    }
                                } else { //se nao existir o atributo, adicione mesmo assim
                                    preco.push(response.produtos.produto[index].precoeup);
                                }

                                //verificando se valor tem mais de 12 caracteres e retirando-o do array
                                for (let i = 0; i < preco.length; i++) {
                                    if (preco[i].length === 12) {
                                        var elemento = preco.indexOf(preco[i]);
                                        preco.splice(elemento, 1);
                                    }
                                }

                                //orderna do menor para o maior
                                var sorting = preco.sort(customSort);

                                //adiciona aos array, os tres produtos com preços baixos
                                setTimeout(function () {
                                    if (response.produtos.produto[index].precoeup === sorting[0]) {
                                        $scope.topTres.push(response.produtos.produto[index]);
                                    }
                                    if (response.produtos.produto[index].precoeup === sorting[1]) {
                                        $scope.topTres.push(response.produtos.produto[index]);
                                    }
                                    if (response.produtos.produto[index].precoeup === sorting[2]) {
                                        $scope.topTres.push(response.produtos.produto[index]);
                                    }
                                    
                                    //há casos com mais de um produto com o mesmo preco e isso causa um bug, esse código previne de ocorrer bug
                                    $scope.topTres = $scope.topTres.filter(function (a) {
                                        return !this[JSON.stringify(a)] && (this[JSON.stringify(a)] = true);
                                    }, Object.create(null));

                                    //limita o tamanho do array a 3
                                    $scope.topTres = $scope.topTres.slice(0,3);

                                    $scope.topTres = $scope.topTres.sort(compare);
                                    $scope.$apply(function(){
                                        $scope.carregando = false;
                                        pronto();
                                        console.log($scope.topTres);
                                    });
                                }, 800);
                            }
                        }
                    }
                }
            }
        }).error(function () {
            console.log('Erro ao carregar documento XML.');                                         
        });
    }

    customSort = function (a, b) {
        return (Number(a.match(/(\d+)/g)[0]) - Number((b.match(/(\d+)/g)[0])));
    }

    compare = function(a, b) {
        if ( a.precoeup < b.precoeup ){
          return -1;
        }
        if ( a.precoeup > b.precoeup ){
          return 1;
        }
        return 0;
    }

    pronto = function() {
        $scope.carregando = false;
        $scope.cdInput = "grupo";
        $scope.precoKit = parseFloat($scope.topTres[0].precoeup);
        grupo();
        valorInvestimento();
    }

    $scope.precoGerador = function(preco) {
        $('html, body').animate({scrollTop: $("#marca-calc").offset().top}, 500);
        $scope.precoKit = parseFloat(preco);
        grupo();
        valorInvestimento();
    }
}]);
 
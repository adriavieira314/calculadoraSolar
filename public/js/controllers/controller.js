var app = angular.module('CalculadoraSolar', ['ui.utils.masks']);

app.controller('Calculadora', ['$scope', function($scope) {
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
            
            // setTimeout(function() {
            //     $(".inputdigita").focus();
            // });

        } else {
            $scope.cdInput = "reais";
            $scope.inputValor = "";
            $scope.mascara = "R$";

            // setTimeout(function() {
            //     $(".inputdigita").focus();
            // });
        }
    }

    $scope.painel = function() {
        if ($scope.selectedPotPainel.id === 1) {
            $scope.potPainel = 335/1000;
            
            // setTimeout(calculoQtdPaineis, 400);
            // setTimeout(calculoArea, 500);

        } else if ($scope.selectedPotPainel.id === 2) {
            $scope.potPainel = 410/1000;

            // setTimeout(calculoQtdPaineis, 400);
            // setTimeout(calculoArea, 500);

        } else {
            $scope.potPainel = 440/1000;

            // setTimeout(calculoQtdPaineis, 400);
            // setTimeout(calculoArea, 500);
        }
    }

    $scope.estrutura = function(id) {
        $scope.estruturaInformada = true;
    }
    //fim

    $scope.resultado = function() {
        calculoEnergia($scope.selectedValor.id);
        calculoPotenciaPico();
        calculoQtdPaineis();
        calculoArea();
        valorInvestimento();
        grupo();
        
        $scope.energiaText = $scope.energia;
        $scope.potPicoText = $scope.potPico;
        $scope.paineisText = $scope.paineis; 
        $scope.areaText = $scope.area;
    }

    $scope.apagar = function() {
        $scope.selectedValor = $scope.energiaOuValor[1].titulo;
        $scope.selectedPotPainel = $scope.potenciaPainel[1].potencia;
        $scope.selectedEstrutura = $scope.estruturas[0].nome;

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
        console.log($scope.potPico);
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

        console.log(painel);
        console.log($scope.paineis);
    }

    calculoArea = function() {
        $scope.area = 2.03 * $scope.paineis;
    }

    grupo = function() {
        if ($scope.potPico >= 104) {
            $('#modalGrupoA').modal('show');
            texto = "Sugerimos que você seja cliente do Grupo A, entre em contato com a engenharia.";
            $(".modal-body").html("");
			$(".modal-body").append('<p style="margin-left: 20px; font-size: 15px; font-weight: bold;">' + texto + '</p>');
            $scope.grupo = "Grupo A";
        } else {
            $scope.cdInput = "grupo"
            $scope.grupo = "Grupo B";
        }
    }

   valorInvestimento = function() {
        if ($scope.potPico > 0 && $scope.potPico < 20) {
            $scope.investimento = 2.000 + 4.346 + 25.000;
            // $scope.inputValor = $scope.investimento;
        }

        if ($scope.potPico >= 20 && $scope.potPico < 25) {
            $scope.investimento = 2.000 + 8.406 + 25.000;
            // $scope.inputValor = $scope.investimento;        
        }

        if ($scope.potPico >= 25 && $scope.potPico < 35) {
            $scope.investimento = 2.500 + 10.098 + 25.000;
            // $scope.inputValor = $scope.investimento;        
        }

        if ($scope.potPico >= 35 && $scope.potPico < 46) {
            $scope.investimento = 2.500 + 12.337 + 25.000;
            // $scope.inputValor = $scope.investimento;        
        }

        if ($scope.potPico >= 46 && $scope.potPico < 57) {
            $scope.investimento = 3.500 + 14.670 + 25.000;
            // $scope.inputValor = $scope.investimento;        
        }

        if ($scope.potPico >= 57 && $scope.potPico < 88) {
            $scope.investimento = 4.000 + 18.090 + 25.000;
            // $scope.inputValor = $scope.investimento;        
        }

        if ($scope.potPico >= 88 && $scope.potPico < 104) {
            $scope.investimento = 4.500 + 23.588 + 25.000;
            // $scope.inputValor = $scope.investimento;        
        }
    }

    // * busca pelo CEP pelo site viaCEP
    //Quando o campo cep perde o foco.
    $scope.encontraCEP = function() {
        // $("#cep").blur(function() {
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
                            alert("CEP não encontrado.");
                            $("#cidade").val("Cidade");
                            $("#uf").val("Estado");
                        }
                    })
                    .fail(function(error) {
                        console.log( "error" + error );
                    });
                } //end if.
                else {
                    //cep é inválido.
                    alert("Formato de CEP inválido.");
                }
            } //end if.
        // });
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
    
    $(document).ready(function(){
        var tam = $(window).width();
      
        if (tam <= 770){
            $("#btn-apagar").removeClass("col");
            $("#btn-apagar").addClass("col-3");
        }
    });
}]);

var app = angular.module('CalculadoraSolar', ['ui.utils.masks']);

app.controller('Calculadora', ['$scope', function($scope) {
	$scope.inputCEP = "";
	$scope.inputCidade = "Cidade";
	$scope.inputUF = "Estado";
	$scope.inputValor = "";
    $scope.cdInput = "cep";
    $scope.mascara = "0";
    $scope.energiaText = "";
    $scope.areaText = "";
    $scope.paineisText = "";
    $scope.potPicoText = "";
    $scope.grupo = "Grupo";
    $scope.cepInformado = false;

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

    $scope.cep = function() {
        $scope.mascara = "0000-000";
        $scope.cdInput = "cep";
    }

    // funcoes para quando o select mudar
    $scope.valor = function(id) {
        
        if ($scope.selectedValor.id === 1) {
            $scope.cdInput = "kwh";
            $scope.mascara = "Consumo (kWh)";
            $scope.inputValor = "";

            // var timer = null;
            // $('#valorInput').keyup(function(){
            //     clearTimeout(timer); 
            //     timer = setTimeout($scope.energia = $scope.inputValor, 400);
            //     timer = setTimeout(calculoPotenciaPico, 500);
            // });

        } else {
            $scope.cdInput = "reais";
            $scope.inputValor = "";
            $scope.mascara = "R$";
            //aguarda 400 milisegundos depois do usuario terminar de digitar para fazer o calculo
            // var timer = null;
            // $('#valorInput').keyup(function(){
            //     clearTimeout(timer);
            //     timer = setTimeout(calculoEnergia, 400);
            //     timer = setTimeout(calculoPotenciaPico, 500);
            // });
        }

    }

    $scope.painel = function(id) {
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
    //fim

    $scope.resultado = function() {
        calculoEnergia($scope.selectedValor.id);
        calculoPotenciaPico();
        calculoQtdPaineis();
        calculoArea();
        calculoPotenciaPico();
        valorInvestimento();
        grupo();
        
        $scope.energiaText = $scope.energia;
        $scope.potPicoText = $scope.potPico;
        $scope.paineisText = $scope.paineis; 
        $scope.areaText = $scope.area;
    }

    $scope.apagar = function() {
        $scope.energiaText = "";
        $scope.energia = "";
        $scope.potPicoText = "";
        $scope.potPico = "";
        $scope.paineisText = "";
        $scope.paineis = ""; 
        $scope.areaText = "";
        $scope.area = "";
        $scope.inputValor = "";
        $scope.cdInput = "cep";
        $scope.mascara = "0";
        $scope.grupo = "Grupo";
        $scope.investimento = "";
        $scope.selectedValor = "";
        $scope.selectedPotPainel = "";
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
        $scope.potPico = $scope.energia/(30 * 4.33 * 0.80);
    }

    calculoQtdPaineis = function() {
        var painel = $scope.potPico/$scope.potPainel;
        $scope.paineis = Math.floor(painel);
        if ($scope.paineis %  2 === 1) {
            $scope.paineis++;
        }
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

    //busca pelo CEP pelo site viaCEP
    //Quando o campo cep perde o foco.
    $("#cep").blur(function() {
        //Verifica se campo cep possui valor informado.
        if ($scope.inputCEP !== "") {
            //Expressão regular para validar o CEP.
            var validacep = /^[0-9]{8}$/;

            //Valida o formato do CEP.
            if(validacep.test($scope.inputCEP)) {
                //Preenche os campos com "..." enquanto consulta webservice.
                $scope.cepInformado = true;
                $("#cidade").val("...");
                $("#uf").val("...");

                //Consulta o webservice viacep.com.br/
                $.getJSON("https://viacep.com.br/ws/"+ $scope.inputCEP +"/json/?callback=?", function(dados) {
                }).done(function(dados) {
                    if (!("erro" in dados)) {
                        //Atualiza os campos com os valores da consulta.
                        // $scope.inputCidade = dados.localidade;
                        // $scope.inputUF = dados.uf;
                        
                            $("#cidade").val(dados.localidade);
                            $("#uf").val(dados.uf);
                    } else {
                            //CEP pesquisado não foi encontrado.
                            alert("CEP não encontrado.");
                        }
                    console.log( "second success" );
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
    });

}]);

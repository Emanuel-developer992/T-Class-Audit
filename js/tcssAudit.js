//EXECUTAR AO CARREGAR A PÁGINA
window.onload = function() {
};

var processValid = 0

$(document).on('change', "#plan_data",
    function stage1() {
        
        processValid = 1;
        auditPlan();
    }
);
$(document).on('change', "#t_audit",
    function stage2() {
        
        processValid = 2;
        auditPlan();
    }
);
$(document).on('change', "#select_area",
    function stage3() {
        
        processValid = 3;
        auditPlan();
    }
);

var nWdk = 0;
function auditPlan() {

    var date = $('#plan_data').val();

    if (processValid == 1) {

        var array2 = DatasetFactory.getDataset("DSFormulariodePlanodeAuditoria", null, null, null);
        $('#t_audit option').remove();
        $('#t_audit').append($('<option>', {

            value: "",
            text: "Selecione..."
        }));

    }
    else if (processValid == 2) {
        var tipo = $("#t_audit").val();

        var c1 = DatasetFactory.createConstraint("tipo_audit", tipo, tipo, ConstraintType.MUST);
        var constraints = new Array(c1);

        var array2 = DatasetFactory.getDataset("DSFormulariodePlanodeAuditoria", null, constraints, null);
        $('#select_area option').remove();
        $('#select_area').append($('<option>', {

            value: "",
            text: "Selecione..."
        }));
    }
    else if (processValid == 3) {
        var tipo = $("#t_audit").val();
        var areaS = $("#select_area").val();

        var c1 = DatasetFactory.createConstraint("tipo_audit", tipo, tipo, ConstraintType.MUST);
        var c2 = DatasetFactory.createConstraint("area_process", areaS, areaS, ConstraintType.MUST);
        var constraints = new Array(c1, c2);

        var array2 = DatasetFactory.getDataset("DSFormulariodePlanodeAuditoria", null, constraints, null);
        $('#select_norma option').remove();
        $('#select_norma').append($('<option>', {

            value: "",
            text: "Selecione..."
        }));
    }

    for (var i = 0; i < array2.values.length; i++) {
        var dateArray = (array2.values[i].date_planA).substring(0, 10);

        if (dateArray == date) {
           
            var area = array2.values[i].area_process;
            var norma = array2.values[i].id_norma;
            var tAudit = array2.values[i].tipo_audit;

            if (processValid == 1) {
                $('#t_audit').append($('<option>', {

                    value: tAudit,
                    text: tAudit
                }));
            }
            else if (processValid == 2) {
                $('#select_area').append($('<option>', {

                    value: area,
                    text: area
                }));
            }
            else if (processValid == 3) {
                $('#select_norma').append($('<option>', {
            
                    value: norma,
                    text: norma
                }));
            }
            
        }

    }
    processValid = 0;
}

var nWdk = 0;
function filter() {

    var table = $('#tb_audit tr');
    for (var i = 2; i < table.length; i++) {
        table[i].remove();
    }

    var area = $('#select_area').val();
    var norma = $('#select_norma').val();
    
    var tb_name = "tb_registroTcss";
    var tbConstraint = DatasetFactory.createConstraint("tablename", tb_name, tb_name, ConstraintType.MUST); // Usar sempre tablename
    var c1 = DatasetFactory.createConstraint("tb_area", area, area, ConstraintType.MUST); // Usar sempre tablename
    var c2 = DatasetFactory.createConstraint("tb_normaR", norma, norma, ConstraintType.MUST); // Usar sempre tablename
    var arrayConstraint = new Array(tbConstraint, c1, c2); // Tranformas as duas constraint em Array
    var array = DatasetFactory.getDataset("DSFormulariodeT-ClassWork", null, arrayConstraint, null);
    var nArray = array.values.length;
    
    for (var i = 0; i < nArray; i++) {

        var req = array.values[i].tb_requisitoR;

        var tb = "tb_registro";
        var tbConst = DatasetFactory.createConstraint("tablename", tb, tb, ConstraintType.MUST); // Usar sempre tablename
        var tbConst2 = DatasetFactory.createConstraint("tb_req", req, req, ConstraintType.MUST); // Usar sempre tablename
        var tbConst3 = DatasetFactory.createConstraint("tb_norma", norma, norma, ConstraintType.MUST); // Usar sempre tablename
        var arrayConst= new Array(tbConst, tbConst2, tbConst3); // Tranformas as duas constraint em Array
        var dataset = DatasetFactory.getDataset("DSFormulariodeCadastrodeRequisito", null, arrayConst, null);

        var desc = dataset.values[0].tb_desc;

        wdkAddChild('tb_audit');
        nWdk++;

        $('#tb_requisito___'+nWdk).val(req);
        $('#tb_desc___'+nWdk).val(desc);
        $('#tb_status___'+nWdk).val('Pendente');

    }

    $(".editar").bind("click", files);
    
}

function files() {

    thisRow = $(this).parent().parent();

    var td0 = thisRow[0].innerHTML;
    var tratamento = td0.replaceAll("</td>","");
    var arrayThis = tratamento.split("<td>");

    var req = (arrayThis[1].substring(11, 29)).replace('"','');
    var desc = (arrayThis[2].substring(14, 27)).replace('"','');
    var status = (arrayThis[4].substring(11, 25)).replace('"','');

    $('#req_evid').val(($('#'+req).val()));
    $('#desc_evid').val(($('#'+desc).val()));
    $('#status_evid').val(($('#'+status).val()));

    var statusVal = $('#'+status).val();

    if (statusVal == 'Conforme') {

        $('#status_evid').addClass('completo-input2');
    }
    else if (statusVal == 'Não Conforme') {
        $('#btn_action').removeClass('nav-close');
        $('#status_evid').addClass('atrasado-input2');
    }
    else if (statusVal == 'Pendente') {
        $('#btn_action').removeClass('nav-close');
        $('#status_evid').addClass('aberto-input2');
    }

    
    
}

function anexo() {
    window.scrollTo(0, 0);
}

$(function() {
    let yearDropdown = $('#year-dropdown');
    let makeDropdown = $('#make-dropdown');
    let typeDropdown = $('#type-dropdown');
    let modelDropdown = $('#model-dropdown');
    let partDropdown = $('#part-dropdown');

    yearDropdown.empty();
    makeDropdown.empty();
    typeDropdown.empty();
    modelDropdown.empty();
    partDropdown.empty();


    yearDropdown.append('<option selected="true" disabled>Choose Year</option>');
    yearDropdown.prop('selectedIndex', 0);


    makeDropdown.append('<option selected="true" disabled>Choose Make</option>');
    makeDropdown.prop('selectedIndex', 0);

    typeDropdown.append('<option selected="true" disabled>Choose Type</option>');
    typeDropdown.prop('selectedIndex', 0);


    modelDropdown.append('<option selected="true" disabled>Choose Model</option>');
    modelDropdown.prop('selectedIndex', 0);


    partDropdown.append('<option selected="true" disabled>Choose Part</option>');
    partDropdown.prop('selectedIndex', 0);

    for (i = new Date().getFullYear(); i > 1926; i--){
        yearDropdown.append($('<option />').val(i).html(i));
    }

    const getMakesurl = 'https://vpic.nhtsa.dot.gov/api/vehicles/getallmakes?format=json';

    // Populate dropdown with list of provinces
    $.getJSON(getMakesurl, function (data) {
         $.each(data.Results, function (key, entry) {
            makeDropdown.append($('<option></option>').attr('value', entry.Make_ID).text(entry.Make_Name));
         })
    });

    makeDropdown.change(function () {  
        var makeId = parseInt($(this).val());  

        if (!isNaN(makeId)) {  
            typeDropdown.empty();  
            typeDropdown.append($("<option></option>").val('').html('Please wait ...'));  

            debugger;  
            $.ajax({  
                url: 'https://vpic.nhtsa.dot.gov/api/vehicles/GetVehicleTypesForMakeId/' + makeId + '?format=json',  
                type: 'GET',  
                dataType: 'json',  
                success: function (data) {  
                    typeDropdown.empty(); // Clear the please wait  
                    typeDropdown.append($("<option></option>").val('').html('Select Type')); 
                        $.each(data.Results, function (key, type) {
                            typeDropdown.append($('<option></option>').attr('value', type.VehicleTypeId).text(type.VehicleTypeName));
                        }) 
                },  
                error: function () {  
                    alert('Error!');  
                }  
            });  
        }  

    });  

    getModelList = function(){
        var type = typeDropdown.find('option:selected').text(); 
        var typeId = makeDropdown.val();
        var makeId = makeDropdown.val();
        var modelYear = yearDropdown.val();
        var url = 'https://vpic.nhtsa.dot.gov/api/vehicles/GetModelsForMakeIdYear/makeId/'+makeId+'/modelyear/'+modelYear+'/vehicleType/'+type+'?format=json';
        if (typeId !== null && makeId !== null && !isNaN(makeId) && !isNaN(typeId)) {
            modelDropdown.empty();  
            modelDropdown.append($("<option></option>").val('').html('Please wait ...'));  

            $.ajax({  
                url: url,  
                type: 'GET',  
                dataType: 'json',  
                success: function (data) {  
                    modelDropdown.empty(); // Clear the please wait  
                    modelDropdown.append($("<option></option>").val('').html('Select Type')); 
                        $.each(data.Results, function (key, model) {
                            modelDropdown.append($('<option></option>').attr('value', model.Model_ID).text(model.Model_Name));
                        }) 
                },  
                error: function () {  
                    alert('Error!');  
                }  
            });  
        }
    }

    typeDropdown.change(getModelList);

    yearDropdown.change(getModelList);
});



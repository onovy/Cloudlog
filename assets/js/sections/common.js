function qsl_rcvd(id, method) {
    $.ajax({
        url: base_url + 'index.php/qso/qsl_rcvd_ajax',
        type: 'post',
        data: {'id': id,
            'method': method
        },
        success: function(data) {
            if (data.message == 'OK') {
                $("#qso_" + id).find("td:eq(8)").find("span:eq(1)").attr('class', 'qsl-green'); // Paints arrow green
                $(".qsl_rcvd_" + id).remove(); // removes choice from menu
            }
            else {
                $(".bootstrap-dialog-message").append('<div class="alert alert-danger"><a href="#" class="close" data-dismiss="alert" aria-label="close">&times;</a>You are not allowed to update QSL status!</div>');
            }
        }
    });
}

function qsl_sent(id, method) {
    $.ajax({
        url: base_url + 'index.php/qso/qsl_sent_ajax',
        type: 'post',
        data: {'id': id,
            'method': method
        },
        success: function(data) {
            if (data.message == 'OK') {
                $("#qso_" + id).find("td:eq(8)").find("span:eq(0)").attr('class', 'qsl-green'); // Paints arrow green
                $(".qsl_sent_" + id).remove(); // removes choice from menu
            }
            else {
                $(".bootstrap-dialog-message").append('<div class="alert alert-danger"><a href="#" class="close" data-dismiss="alert" aria-label="close">&times;</a>You are not allowed to update QSL status!</div>');
            }
        }
    });
}

// Function: qsl_requested
// Marks QSL card requested against the QSO.
function qsl_requested(id, method) {
    $.ajax({
        url: base_url + 'index.php/qso/qsl_requested_ajax',
        type: 'post',
        data: {'id': id,
            'method': method
        },
        success: function(data) {
            if (data.message == 'OK') {
                $("#qso_" + id).find("td:eq(8)").find("span:eq(0)").attr('class', 'qsl-yellow'); // Paints arrow green
            }
            else {
                $(".bootstrap-dialog-message").append('<div class="alert alert-danger"><a href="#" class="close" data-dismiss="alert" aria-label="close">&times;</a>You are not allowed to update QSL status!</div>');
            }
        }
    });
}

// Function: qsl_ignore
// Marks QSL card ignore against the QSO.
function qsl_ignore(id, method) {
    $.ajax({
        url: base_url + 'index.php/qso/qsl_ignore_ajax',
        type: 'post',
        data: {'id': id,
            'method': method
        },
        success: function(data) {
            if (data.message == 'OK') {
                $("#qso_" + id).find("td:eq(8)").find("span:eq(0)").attr('class', 'qsl-grey'); // Paints arrow grey
            }
            else {
                $(".bootstrap-dialog-message").append('<div class="alert alert-danger"><a href="#" class="close" data-dismiss="alert" aria-label="close">&times;</a>You are not allowed to update QSL status!</div>');
            }
        }
    });
}

function qso_delete(id, call) {
    BootstrapDialog.confirm({
        title: 'DANGER',
        message: 'Warning! Are you sure you want delete QSO with ' + call + '?' ,
        type: BootstrapDialog.TYPE_DANGER,
        closable: true,
        draggable: true,
        btnOKClass: 'btn-danger',
        callback: function(result) {
            if(result) {
                $(".edit-dialog").modal('hide');
                $(".qso-dialog").modal('hide');
                $.ajax({
                    url: base_url + 'index.php/qso/delete_ajax',
                    type: 'post',
                    data: {'id': id
                    },
                    success: function(data) {
                        $(".alert").remove();
                        $(".bootstrap-dialog-message").prepend('<div class="alert alert-danger"><a href="#" class="close" data-dismiss="alert" aria-label="close">&times;</a>The contact with ' + call + ' has been deleted!</div>');
                        $("#qso_" + id).remove(); // removes qso from table in dialog
                    }
                });
            }
        }
    });
}

function qso_edit(id) {
    $.ajax({
        url: base_url + 'index.php/qso/edit_ajax',
        type: 'post',
        data: {'id': id
        },
        success: function(html) {
            BootstrapDialog.show({
                title: 'QSO Data',
                cssClass: 'edit-dialog',
                size: BootstrapDialog.SIZE_WIDE,
                nl2br: false,
                message: html,
                onshown: function(dialog) {
                    var state = $("#input_usa_state_edit option:selected").text();
                    if (state != "") {
                        $("#stationCntyInputEdit").prop('disabled', false);
                        selectize_usa_county();
                    }

                    $('#input_usa_state_edit').change(function(){
                        var state = $("#input_usa_state_edit option:selected").text();
                        if (state != "") {
                            $("#stationCntyInputEdit").prop('disabled', false);

                            selectize_usa_county();

                        } else {
                            $("#stationCntyInputEdit").prop('disabled', true);
                            //$('#stationCntyInput')[0].selectize.destroy();
                            $("#stationCntyInputEdit").val("");
                        }
                    });

                    $('#sota_ref_edit').selectize({
                        maxItems: 1,
                        closeAfterSelect: true,
                        loadThrottle: 250,
                        valueField: 'name',
                        labelField: 'name',
                        searchField: 'name',
                        options: [],
                        create: true,
                        load: function(query, callback) {
                            if (!query || query.length < 3) return callback();  // Only trigger if 3 or more characters are entered
                            $.ajax({
                                url: base_url+'index.php/qso/get_sota',
                                type: 'GET',
                                dataType: 'json',
                                data: {
                                    query: query,
                                },
                                error: function() {
                                    callback();
                                },
                                success: function(res) {
                                    callback(res);
                                }
                            });
                        }
                    });

                    $('#wwff_ref_edit').selectize({
                        maxItems: 1,
                        closeAfterSelect: true,
                        loadThrottle: 250,
                        valueField: 'name',
                        labelField: 'name',
                        searchField: 'name',
                        options: [],
                        create: true,
                        load: function(query, callback) {
                            if (!query || query.length < 3) return callback();  // Only trigger if 3 or more characters are entered
                            $.ajax({
                                url: base_url+'index.php/qso/get_wwff',
                                type: 'GET',
                                dataType: 'json',
                                data: {
                                    query: query,
                                },
                                error: function() {
                                    callback();
                                },
                                success: function(res) {
                                    callback(res);
                                }
                            });
                        }
                    });

                    $('#pota_ref_edit').selectize({
                        maxItems: 1,
                        closeAfterSelect: true,
                        loadThrottle: 250,
                        valueField: 'name',
                        labelField: 'name',
                        searchField: 'name',
                        options: [],
                        create: true,
                        load: function(query, callback) {
                            if (!query || query.length < 3) return callback();  // Only trigger if 3 or more characters are entered
                            $.ajax({
                                url: base_url+'index.php/qso/get_pota',
                                type: 'GET',
                                dataType: 'json',
                                data: {
                                    query: query,
                                },
                                error: function() {
                                    callback();
                                },
                                success: function(res) {
                                    callback(res);
                                }
                            });
                        }
                    });

                    $('#darc_dok_edit').selectize({
                        maxItems: 1,
                        closeAfterSelect: true,
                        loadThrottle: 250,
                        valueField: 'name',
                        labelField: 'name',
                        searchField: 'name',
                        options: [],
                        create: true,
                        load: function(query, callback) {
                            if (!query) return callback();  // Only trigger if 3 or more characters are entered
                            $.ajax({
                                url: base_url+'index.php/qso/get_dok',
                                type: 'GET',
                                dataType: 'json',
                                data: {
                                    query: query,
                                },
                                error: function() {
                                    callback();
                                },
                                success: function(res) {
                                    callback(res);
                                }
                            });
                        }
                    });
                },
            });
        }
    });
}

function spawnQrbCalculator(locator1, locator2) {
	$.ajax({
		url: base_url + 'index.php/qrbcalc',
		type: 'post',
		success: function (html) {
			BootstrapDialog.show({
				title: 'Compute QRB and QTF',
				size: BootstrapDialog.SIZE_WIDE,
				cssClass: 'lookup-dialog',
				nl2br: false,
				message: html,
				onshown: function(dialog) {
                    if (locator1 !== undefined) {
                        $("#qrbcalc_locator1").val(locator1);
                    }
                    if (locator2 !== undefined) {
                        $("#qrbcalc_locator2").val(locator2);
                        calculateQrb();
                    }
				},
				buttons: [{
					label: 'Close',
					action: function (dialogItself) {
						dialogItself.close();
					}
				}]
			});
		}
	});
}

function spawnActivatorsMap(call, count, grids) {
	$.ajax({
		url: base_url + 'index.php/activatorsmap',
		type: 'post',
		success: function (html) {
			BootstrapDialog.show({
				title: 'Activators Map',
				size: BootstrapDialog.SIZE_WIDE,
				cssClass: 'lookup-dialog',
				nl2br: false,
				message: html,
				onshown: function(dialog) {
					showActivatorsMap(call, count, grids);
				},
				buttons: [{
					label: 'Close',
					action: function (dialogItself) {
						dialogItself.close();
					}
				}]
			});
		}
	});
}

function calculateQrb() {
    let locator1 = $("#qrbcalc_locator1").val();
    let locator2 = $("#qrbcalc_locator2").val();

    $(".qrbalert").remove();

    if (validateLocator(locator1) && validateLocator(locator2)) {
        $.ajax({
            url: base_url+'index.php/qrbcalc/calculate',
            type: 'post',
            data: {'locator1': locator1,
                    'locator2': locator2},
            success: function (html) {
                
                var result = "<h5>Negative latitudes are south of the equator, negative longitudes are west of Greenwich. <br/>";
                result += ' ' + locator1.toUpperCase() + ' Latitude = ' + html['latlng1'][0] + ' Longitude = ' + html['latlng1'][1] + '<br/>';
                result += ' ' + locator2.toUpperCase() + ' Latitude = ' + html['latlng2'][0] + ' Longitude = ' + html['latlng2'][1] + '<br/>';
                result += 'Distance between ' + locator1.toUpperCase() + ' and ' + locator2.toUpperCase() + ' is ' + html['distance'] + '.<br />';
                result += 'The bearing is ' + html['bearing'] + '.</h5>';
                
                $(".qrbResult").html(result);
                newpath(html['latlng1'], html['latlng2'], locator1, locator2);
            }
        });
    } else {
        $('.qrbResult').html('<div class="qrbalert alert alert-danger" role="alert">Error in locators. Please check.</div>');
    }
}

function validateLocator(locator) {
    if(locator.length < 4 && !(/^[a-rA-R]{2}[0-9]{2}[a-xA-X]{0,2}[0-9]{0,2}[a-xA-X]{0,2}$/.test(locator))) {
        return false;
    }
    
    return true;
}

// This displays the dialog with the form and it's where the resulttable is displayed
function spawnLookupModal() {
	$.ajax({
		url: base_url + 'index.php/lookup',
		type: 'post',
		success: function (html) {
			BootstrapDialog.show({
				title: 'Quick lookup',
				size: BootstrapDialog.SIZE_WIDE,
				cssClass: 'lookup-dialog',
				nl2br: false,
				message: html,
				onshown: function(dialog) {
					$('#quicklookuptype').change(function(){
						var type = $('#quicklookuptype').val();
						if (type == "dxcc") {
							$('#quicklookupdxcc').show();
							$('#quicklookupiota').hide();
							$('#quicklookupcqz').hide();
							$('#quicklookupwas').hide();
							$('#quicklookuptext').hide();
						} else if (type == "iota") {
							$('#quicklookupiota').show();
							$('#quicklookupdxcc').hide();
							$('#quicklookupcqz').hide();
							$('#quicklookupwas').hide();
							$('#quicklookuptext').hide();
						} else if (type == "grid" || type == "sota" || type == "wwff") {
							$('#quicklookuptext').show();
							$('#quicklookupiota').hide();
							$('#quicklookupdxcc').hide();
							$('#quicklookupcqz').hide();
							$('#quicklookupwas').hide();
						} else if (type == "cqz") {
							$('#quicklookupcqz').show();
							$('#quicklookupiota').hide();
							$('#quicklookupdxcc').hide();
							$('#quicklookupwas').hide();
							$('#quicklookuptext').hide();
						} else if (type == "was") {
							$('#quicklookupwas').show();
							$('#quicklookupcqz').hide();
							$('#quicklookupiota').hide();
							$('#quicklookupdxcc').hide();
							$('#quicklookuptext').hide();
						}
					});
				},
				buttons: [{
					label: 'Close',
					action: function (dialogItself) {
						dialogItself.close();
					}
				}]
			});
		}
	});
}

// This function executes the call to the backend for fetching queryresult and displays the table in the dialog
function getLookupResult() {
	$(".ld-ext-right").addClass('running');
	$(".ld-ext-right").prop('disabled', true);
	$.ajax({
		url: base_url + 'index.php/lookup/search',
		type: 'post',
		data: {
			type: $('#quicklookuptype').val(),
			dxcc: $('#quicklookupdxcc').val(),
			was:  $('#quicklookupwas').val(),
			grid: $('#quicklookuptext').val(),
			cqz:  $('#quicklookupcqz').val(),
			iota: $('#quicklookupiota').val(),
			sota: $('#quicklookuptext').val(),
			wwff: $('#quicklookuptext').val(),
		},
		success: function (html) {
			$('#lookupresulttable').html(html);
			$(".ld-ext-right").removeClass('running');
			$(".ld-ext-right").prop('disabled', false);
		}
	});
}

// This function executes the call to the backend for fetching dxcc summary and inserted table below qso entry
function getDxccResult(dxcc, name) {
	$.ajax({
		url: base_url + 'index.php/lookup/search',
		type: 'post',
		data: {
			type: 'dxcc',
			dxcc: dxcc,
		},
		success: function (html) {
            $('.dxccsummary').remove();
            $('.qsopane').append('<div class="dxccsummary col-sm-12"><br><div class="card"><div class="card-header" data-toggle="collapse" data-target=".dxccsummarybody">DXCC Summary for '+name+'</div><div class="card-body collapse dxccsummarybody"></div></div></div>');
            $('.dxccsummarybody').append(html);
		}
	});
}

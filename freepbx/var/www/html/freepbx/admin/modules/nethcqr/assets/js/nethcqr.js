//
//   Copyright (C) 2017 Nethesis S.r.l.
//   http://www.nethesis.it - support@nethesis.it
//   
//   This file is part of CQR.
//
//   CQR is free software: you can redistribute it and/or modify
//   it under the terms of the GNU General Public License as published by
//   the Free Software Foundation, either version 3 of the License, or any 
//   later version.
//
//   CQR is distributed in the hope that it will be useful,
//   but WITHOUT ANY WARRANTY; without even the implied warranty of
//   MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
//   GNU General Public License for more details.
//
//   You should have received a copy of the GNU General Public License
//   along with CQR.  If not, see <http://www.gnu.org/licenses/>.
//

$(document).ready(function(){
	//on load, hide elememnts that may need to be hidden
	invalid_elements();
	timeout_elements();

	var new_entrie = '<tr>' + $('#nethcqr_entries > tbody:last').find('tr:last').html() + '</tr>';
	$('#add_entrie').click(function(){
		id = new Date().getTime();//must be cached, as we have many replaces to do and the time can shift
		var last_position = $('#nethcqr_entries > tbody:last').find('tr:last').find('input[name="entries[position][]"]').val()
		$('#nethcqr_entries > tbody:last').find('tr:last').after(new_entrie.replace(/DESTID/g, id));
		$('#nethcqr_entries > tbody:last').find('tr:last').find('input[name="entries[position][]"]').val(Number(last_position)+1);
		$('#nethcqr_entries > tbody:last').find('tr:last').find('input[name="entries[condition][]"]').val("");
		bind_dests_double_selects();
	});
	
	$('input[type=submit]').click(function(){
		//remove the last blank field so that it isnt subject to validation, assuming it wasnt set
		//called from .click() as that is fired before validation
		last = $('#nethcqr_entries > tbody:last').find('tr:last');
		if(last.find('input[name="entries[ext][]"]').val() == ''
			&& last.find('.destdropdown').val() == ''){
			last.remove()
		}
	});
	
 	$('[name=frm_nethcqr]').submit(function(){
		//set timeout/invalid destination, removing hidden field if there is no valus being set
		if ($('#invalid_loops').val() != 'disabled') {
			invalid = $('[name=' + $('[name=gotoinvalid]').val() + 'invalid]').val();
			$('#invalid_destination').val(invalid)
		} else {
			$('#invalid_destination').remove()
		}
		
		if ($('#timeout_loops').val() != 'disabled') {
			timeout = $('[name=' + $('[name=gototimeout]').val() + 'timeout]').val();
			$('#timeout_destination').val(timeout)
		} else {
			$('#timeout_destination').remove()
		}
		
		//set default_destination field
                num = $('[name=goto99999]').attr('name').replace('goto', '');
                dest = $('[name=' + $('[name=goto99999]').val() + num + ']').val();
                $('#default_destination').attr('value',dest);          
		$('[name=goto99999]').attr("disabled", "disabled");
                $('[name=goto99999]').attr('name','changed_name');
		//set goto fields for destinations
		$('[name^=goto]').each(function(){
			num = $(this).attr('name').replace('goto', '');
			dest = $('[name=' + $(this).val() + num + ']').val();
			$(this).parent().find('input[name="entries[goto][]"]').val(dest);
		//console.log(num, dest, $(this).parent().find('input[name="entries[goto][]"]').val())
		})
		
		//set ret_ivr checkboxes to SOMETHING so that they get sent back
		$('[name="entries[cqr_ret][]"]').not(':checked').each(function(){
			$(this).attr('checked', 'checked').val('uncheked')
		})
		
		//disable dests so that they dont get posted
		$('.destdropdown, .destdropdown2').attr("disabled", "disabled");
	})
	
	//reenable dests in case there was an error on the page and it didnt get postedj
	$('[name=frm_nethcqr]').submit(function(){
		setTimeout(restore_form_elemens, 100);
	})
	
	//delete rows on click
	$('.delete_entrie').on('click', function(){
		$(this).closest('tr').fadeOut('normal', function(){$(this).closest('tr').remove();})
	})
	
	//show/hide invalid elements on change
	$('#invalid_loops').change(invalid_elements)
	
	//show/hide timeout elements on change
	$('#timeout_loops').change(timeout_elements)

	//show/hide manual code fields
	manual_code_switch();
});

function restore_form_elemens() {
	$('.destdropdown, .destdropdown2').removeAttr('disabled')
	$('[name="entries[cqr_ret][]"][value=uncheked]').each(function(){
		$(this).removeAttr('checked')
	})
	invalid_elements();
	timeout_elements();
}

//always disable hidden elements so that they dont trigger validation
function invalid_elements() {
	var invalid_elements = $('#invalid_retry_recording, #invalid_recording, [name=gotoinvalid]');
	var invalid_element_tr = invalid_elements.parent().parent();
	switch ($('#invalid_loops').val()) {
		case 'disabled':
			invalid_elements.attr('disabled', 'disabled')
			invalid_element_tr.hide()
			break;
		case '0':
			invalid_elements.removeAttr('disabled')
			invalid_element_tr.show();
			$('#invalid_retry_recording').parent().parent().hide();
			break;
		default:
			invalid_elements.removeAttr('disabled')
			invalid_element_tr.show()
			break;
	}
}

//always disable hidden elements so that they dont trigger validation
function timeout_elements() {
	var timeout_elements = $('#timeout_retry_recording, #timeout_recording, [name=gototimeout]');
	var timeout_element_tr = timeout_elements.parent().parent();
	switch ($('#timeout_loops').val()) {
		case 'disabled':
			timeout_elements.attr('disabled', 'disabled')
			timeout_element_tr.hide()
			break;
		case '0':
			timeout_elements.removeAttr('disabled')
			timeout_element_tr.show();
			$('#timeout_retry_recording').attr('disabled', 'disabled').parent().parent().hide();
		default:
			timeout_elements.removeAttr('disabled')
			timeout_element_tr.show()
			break;
	}
}

//hide/show client code announce and client code error announce checking manual code checkbox state
function manual_code_switch(){
    if($("#manual_code").attr('checked')==='checked')
    {
        $("#cod_cli_announcement").parent().parent().show();
        $("#err_announcement").parent().parent().show();
        $("#code_length").parent().parent().show();
        $("#code_retries").parent().parent().show();
        $("#ccc_query").parent().parent().show();
    } else {
        $("#cod_cli_announcement").parent().parent().hide();
        $("#err_announcement").parent().parent().hide();
        $("#code_length").parent().parent().hide();
        $("#code_retries").parent().parent().hide();
        $("#ccc_query").parent().parent().hide();
    }

};

$("#manual_code").on('change',function () {
manual_code_switch();
});


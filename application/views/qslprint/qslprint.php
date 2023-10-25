<?php

function echo_qsl_sent_via($method) {
	switch($method) {
		case 'B': echo 'Bureau'; break;
		case 'D': echo 'Direct'; break;
		case 'E': echo 'Electronic'; break;
	}
}

if (empty($station_id)) {
	$station_id = 'all';
}

if ($qsos->result() != NULL) {
        echo '<div style="padding-top: 10px; margin-top: 0px;" class="container logbook">';
	echo '<table style="width:100%" class="table table-sm table-bordered table-hover table-striped table-condensed qslprint">
<thead>
<tr>
<th style=\'text-align: center\'><div class="form-check" style="margin-top: -1.5em"><input class="form-check-input" type="checkbox" id="checkBoxAll" /></div></th>
<th style=\'text-align: center\'>'.lang('gen_hamradio_callsign').'</th>
<th style=\'text-align: center\'>' . lang('general_word_date') . '</th>
<th style=\'text-align: center\'>'. lang('general_word_time') .'</th>
<th style=\'text-align: center\'>' . lang('gen_hamradio_mode') . '</th>
<th style=\'text-align: center\'>' . lang('gen_hamradio_band') . '</th>
<th style=\'text-align: center\'>' . lang('gen_hamradio_qsl') . ' ' . lang('general_word_qslcard_via') . '</th>
<th style=\'text-align: center\'>' . lang('gen_hamradio_station') . '</th>
<th style=\'text-align: center\'>Sent method</th>
<th style=\'text-align: center\'>Mark as sent</th>
<th style=\'text-align: center\'>Remove</th>
<th style=\'text-align: center\'>QSO List</th>
</tr>
</thead><tbody>';

	// Get Date format
	if($this->session->userdata('user_date_format')) {
		// If Logged in and session exists
		$custom_date_format = $this->session->userdata('user_date_format');
	} else {
		// Get Default date format from /config/cloudlog.php
		$custom_date_format = $this->config->item('qso_date_format');
	}

	foreach ($qsos->result() as $qsl) {
		echo '<tr id="qslprint_'.$qsl->COL_PRIMARY_KEY.'">';
		echo '<td style=\'text-align: center\'><div class="form-check"><input class="form-check-input" type="checkbox" /></div></td>';
                ?><td style='text-align: center'><span class="qso_call"><a id="edit_qso" href="javascript:displayQso(<?php echo $qsl->COL_PRIMARY_KEY; ?>);"><?php echo str_replace("0","&Oslash;",strtoupper($qsl->COL_CALL)); ?></a><a target="_blank" href="https://www.qrz.com/db/<?php echo strtoupper($qsl->COL_CALL); ?>"><img width="16" height="16" src="<?php echo base_url(); ?>images/icons/qrz.png" alt="Lookup <?php echo strtoupper($qsl->COL_CALL); ?> on QRZ.com"></a> <a target="_blank" href="https://www.hamqth.com/<?php echo strtoupper($qsl->COL_CALL); ?>"><img width="16" height="16" src="<?php echo base_url(); ?>images/icons/hamqth.png" alt="Lookup <?php echo strtoupper($qsl->COL_CALL); ?> on HamQTH"></a> <a target="_blank" href="http://www.eqsl.cc/Member.cfm?<?php echo strtoupper($qsl->COL_CALL); ?>"><img width="16" height="16" src="<?php echo base_url(); ?>images/icons/eqsl.png" alt="Lookup <?php echo strtoupper($qsl->COL_CALL); ?> on eQSL.cc"></a></td><?php 
		echo '<td style=\'text-align: center\'>'; $timestamp = strtotime($qsl->COL_TIME_ON); echo date($custom_date_format, $timestamp); echo '</td>';
		echo '<td style=\'text-align: center\'>'; $timestamp = strtotime($qsl->COL_TIME_ON); echo date('H:i', $timestamp); echo '</td>';
		echo '<td style=\'text-align: center\'>'; echo $qsl->COL_SUBMODE==null?$qsl->COL_MODE:$qsl->COL_SUBMODE; echo '</td>';
		echo '<td style=\'text-align: center\'>'; if($qsl->COL_SAT_NAME != null) { echo $qsl->COL_SAT_NAME; } else { echo strtolower($qsl->COL_BAND); }; echo '</td>';
		echo '<td style=\'text-align: center\'>' . $qsl->COL_QSL_VIA . '</td>';
		echo '<td style=\'text-align: center\'><span class="badge badge-light">' . $qsl->station_callsign . '</span></td>';
		echo '<td style=\'text-align: center\'>'; echo_qsl_sent_via($qsl->COL_QSL_SENT_VIA); echo '</td>';
		echo '<td style=\'text-align: center\'><button onclick="mark_qsl_sent(\''.$qsl->COL_PRIMARY_KEY.'\', \'B\')" class="btn btn-sm btn-success"><i class="fa fa-check"></i></button></td>';
		echo '<td style=\'text-align: center\'><button onclick="deleteFromQslQueue(\''.$qsl->COL_PRIMARY_KEY.'\')" class="btn btn-sm btn-danger"><i class="fas fa-trash-alt"></i></button></td>';
		echo '<td style=\'text-align: center\'><button onclick="openQsoList(\''.$qsl->COL_CALL.'\')" class="btn btn-sm btn-success"><i class="fas fa-search"></i></button></td>';
		echo '</tr>';
	}
	echo '</tbody></table></div>';
	?>

	<p><button onclick="markSelectedQsos();" title="Mark selected QSOs as printed" class="btn btn-success markallprinted">Mark selected QSOs as printed</button>

	<button onclick="removeSelectedQsos();" title="Remove seleced QSOS from print queue" class="btn btn-danger removeall">Remove selected QSOs from the queue</button></p>

	<p><a href="<?php echo site_url('qslprint/exportcsv/' . $station_id); ?>" title="Export CSV-file" class="btn btn-primary">Export requested QSLs to CSV-file</a>

	<a href="<?php echo site_url('qslprint/exportadif/' . $station_id); ?>" title="Export ADIF" class="btn btn-primary">Export requested QSLs to ADIF-file</a>

	<a href="<?php echo site_url('qslprint/qsl_printed/' . $station_id); ?>" title="Mark QSLs as printed" class="btn btn-primary">Mark requested QSLs as sent</a></p>

<?php
} else {
	echo '<div class="alert alert-danger"><a href="#" class="close" data-dismiss="alert" aria-label="close">&times;</a>No QSL\'s to print were found!</div>';
}
?>

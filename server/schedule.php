<?php 
    if (isset($_GET['sid'])) {
        $sid = $_GET['sid'];

        $curl = curl_init();

        curl_setopt_array($curl, array(
        CURLOPT_URL => 'https://nl.infothek-sptk.com/isps/plugins/infothek/mycal?cmd=listphases&page=/template/scheduling/infothek/phstbl.html&sid=' . $sid . '&width=662&height=634&userid=0',
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_ENCODING => '',
        CURLOPT_MAXREDIRS => 10,
        CURLOPT_TIMEOUT => 0,
        CURLOPT_FOLLOWLOCATION => true,
        CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
        CURLOPT_CUSTOMREQUEST => 'GET',
        ));

        $response = curl_exec($curl);

        curl_close($curl);
        echo $response;
    } else {
        echo("error");
    }
?>

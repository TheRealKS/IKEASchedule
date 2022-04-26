<?php
    if (isset($_GET['pwd']) && isset($_GET['name'])) {
        $pwd = $_GET['pwd'];
        $name = $_GET['name'];

        $curl = curl_init();

        curl_setopt_array($curl, array(
        CURLOPT_URL => 'https://nl.infothek-sptk.com/isps/plugins/logon?dummy=1650019521385',
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_ENCODING => '',
        CURLOPT_MAXREDIRS => 10,
        CURLOPT_TIMEOUT => 0,
        CURLOPT_FOLLOWLOCATION => true,
        CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
        CURLOPT_CUSTOMREQUEST => 'POST',
        CURLOPT_POSTFIELDS =>'usrsys=0&bws=0&target=/infothek/loginResult.js&fail target=loginfailinf1.html&lid=1043&pwd=' . $pwd . '&name=' .$name,
        CURLOPT_HTTPHEADER => array(
            'Content-Type: text/plain'
        ),
        ));

        $response = curl_exec($curl);

        curl_close($curl);
        echo $response;
    } else {
        echo("error");
    }
?>
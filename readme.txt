Port
    5101
        Webserver
    5102
        Configserver
            /api/init                                   -> Initialisiert die Datenbank
            
            /api/config/numOfBlocks/:value              -> Ver�ndert die gegebene Konfiguration mit einem neuem Wert
                        widthOfBlock
                        waviness
                        speed
                        
            /api/config/default                         -> Setzt die Konfigurationen wieder auf ihre Standardwerte
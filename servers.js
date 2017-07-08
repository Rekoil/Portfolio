var app = new Vue({
    el: '#app',
    data: {
        servers: [], // the servers array
        api_url: 'https://api.truckersmp.com/v2/servers/', // the truckersmp servers api url
        updateTimer: 5 // the time in seconds between each update

    },
    mounted: function() {
        // Initialize servers request
        this.getServers();

        // Set update interval
        setInterval(this.updateServers, this.updateTimer * 1000);
    },
    methods: {
        getServers: function () {
            var servers_array = this.servers;
            $.getJSON(this.api_url)
                .done(function(tmp_api) {
                    if (tmp_api.response)
                    {
                        var server_count = 0;
                        console.log("%c---- Getting servers data from TruckersMP ----", "background: blue; color: white;");
                        $.each(tmp_api.response, function(i, server) {
                            server['players_percent'] = ((server['players'] / server['maxplayers']) * 100).toFixed(2);
                            server['online'] = (server['online'] === true ? 'Online' : ' Offline');
                            server['speedlimiter'] = (server['speedlimiter'] === 1 ? 'Enabled' : 'Disabled');
                            server['game'] = (server['game'] === 'ETS2' ? 'Euro Truck Simulator 2' : 'American Truck Simulator');
                            servers_array.push(server);
                            server_count++;
                        });
                        console.log("» " + server_count + " servers loaded.");
                        console.log("%c----------------------------------------------", "background: blue; color: white;");
                    }
                    else
                    {
                        console.log("%c---- Getting servers data from TruckersMP ----", "background: blue; color: white;");
                        console.log("%cERROR: Failed to read the response value.", "color: red;");
                        console.log("%c----------------------------------------------", "background: blue; color: white;");
                    }
                })
                .fail(function() {
                    console.log("---- Getting servers data from TruckersMP ----", "background: blue; color: white;");
                    console.log("ERROR: Failed to connect with the servers.");
                    console.log("----------------------------------------------", "background: blue; color: white;");
                });
        },
        updateServers: function () {
            var servers_array = this.servers;
            var newServers_array = [];

            $.getJSON(this.api_url)
                .done(function(tmp_api) {
                    if (tmp_api.response)
                    {
                        var server_count = 0;
                        console.log("%c----          Updating servers            ----", "background: green; color: white;");
                        $.each(tmp_api.response, function(i, server) {
                            if (i >= servers_array.length) return;
                            server['players_percent'] = ((server['players'] / server['maxplayers']) * 100).toFixed(2);
                            server['online'] = (server['online'] === true ? 'Online' : ' Offline');
                            server['speedlimiter'] = (server['speedlimiter'] === 1 ? 'Enabled' : 'Disabled');
                            server['game'] = (server['game'] === 'ETS2' ? 'Euro Truck Simulator 2' : 'American Truck Simulator');
                            newServers_array.push(server);
                            server_count++;
                        });
                        console.log("» " + server_count + " servers loaded.");

                        var server_count = 0;
                        $.each(servers_array, function(i, server) {
                            server['online'] = newServers_array[i]['online'];
                            server['players'] = newServers_array[i]['players'];
                            server['maxplayers'] = newServers_array[i]['maxplayers'];
                            server['queue'] = newServers_array[i]['queue'];
                            server['players_percent'] = newServers_array[i]['players_percent'];
                            server_count++;
                        });
                        console.log("%c» " + server_count + " servers updated.", "color: orange;");
                        console.log("%c----------------------------------------------", "background: green; color: white;");
                    }
                    else
                    {
                        console.log("%c----          Updating servers            ----", "background: green; color: white;");
                        console.log("%cERROR: Failed to read the response value.", "color: red;");
                        console.log("%c----------------------------------------------", "background: green; color: white;");
                    }
                })
                .fail(function() {
                    console.log("%c----          Updating servers            ----", "background: green; color: white;");
                    console.log("%cERROR: Failed to connect with the servers.", "color: red;");
                    console.log("%c----------------------------------------------", "background: green; color: white;");
                });
            
            $('#updated').fadeIn().delay(1000).fadeOut();
        }
    }
})

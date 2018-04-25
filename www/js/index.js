/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
var app = {
    // Application Constructor
    initialize: function() {
        document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);
    },

    // deviceready Event Handler
    //
    // Bind any cordova events here. Common events are:
    // 'pause', 'resume', etc.
    onDeviceReady: function() {
        this.receivedEvent('deviceready');

        ble.startStateNotifications(
            function(state) {
                console.log("Bluetooth is " + state);
                bluetoothStateSpan.innerHTML = state;
            }
        );

        statusDiv.innerHTML = 'Attempting to connect to BLE device in 5 seconds';
        setTimeout(app.connectToDevice, 5);
    },

    connectToDevice: function() {

        var connected = function(peripheral) {
            statusDiv.innerHTML = 'Connected to ' + peripheral.id;
        }

        var disconnected = function(peripheral) {
            statusDiv.innerHTML = 'Disconnected from ' + peripheral.id;
        }

        var SERVICE_UUID = 'FFE0'; // NOTE: change this to match your device UUID

        statusDiv.innerHTML = 'Scanning for ' + SERVICE_UUID;
        ble.startScan([SERVICE_UUID], function(device) {
            statusDiv.innerHTML = 'Found ' + device.id;
            // this is a demo, stop scanning and connect to the first device
            ble.stopScan(
                function() {
                    ble.connect(device.id, connected, disconnected);
                },
                function() {
                    console.log('Failed to stop scan');
                    statusDiv.innerHTML = 'Failed to stop scan';
                }
            );
        })

    },

    // Update DOM on a Received Event
    receivedEvent: function(id) {
        var parentElement = document.getElementById(id);
        var listeningElement = parentElement.querySelector('.listening');
        var receivedElement = parentElement.querySelector('.received');

        listeningElement.setAttribute('style', 'display:none;');
        receivedElement.setAttribute('style', 'display:block;');

        console.log('Received Event: ' + id);
    }
};

app.initialize();
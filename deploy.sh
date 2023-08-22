#!/bin/bash

source_directory="./build/contracts"
destination_directory_client="./client/src/contracts"
destination_directory_api="./api/src/contracts"

# Deploy contracts
truffle migrate

# Copy files from source to destination for client
cp -r "$source_directory"/* "$destination_directory_client"/
echo "Files copied from $source_directory to $destination_directory_client"

# Copy files from source to destination for API
cp -r "$source_directory"/* "$destination_directory_api"/
echo "Files copied from $source_directory to $destination_directory_api"

read -p "Press any key to resume ..."

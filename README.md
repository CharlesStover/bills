# Bills
This repository contains a bill-splitting utility to help manage finances shared between individuals.

[![image](https://user-images.githubusercontent.com/343837/44632574-c7cf7e00-a942-11e8-8100-64709770e3ec.png)](https://charlesstover.com/)

## Use
Create a volume linking a directory on your server to `/var/www/payments`.
Inside that volume, create a `_.txt` file that contains each paying member on a separate line.
Inside that same volume, for each paying member, create a file named `THEIR_NAME.txt`. This is where their contributions will be written.

## Tech Stack
* Docker - containerized application
* HTML/CSS - graphical user interface
* Node - logic and file system read/writes
* PHP - an optional PHP alternative can be found in the `/php` directory

# Running this
To run this you have to go to the directory where it resides in your terminal, run any of the avaiable commands with prefix ``./index.js``. You will likely get a permission denied error, to fix that run the following command:
```
$   chmod 777 index.js
```
This will change the proyect's permissions and allow you to run it.
# Commands
## balance
Reports the current balance of all accounts. It accepts a list of optional names, which confine the balance report to the matching accounts.

## The register command
The register command displays all the postings occurring in an account. The account name(s) must be specified as the only argument to this command.

## The print command
The print command prints out ledger transactions in a textual format that can be parsed by Ledger.

# Flags
## File
It is used to specify the name and path of the file where the ledger data is stored,  when the data file is not specified, it takes as default ``data/index.ledger``
```
$   ledger -f <file name> <command>
```
The ``-f`` flag is used to indicate that the following argument is the file name, it is short for ``-file``. 
## Sort
This flag can be used for the balance and print command to sort the output.
```
$   ledger <valid command> -s <sort method>
```
The ``-s`` flag is used to indicate that the following argument is the sorting method, it is short for ``-sort``. Available sorting methods are:
* "d" or "date": Sort by date in ascending order (default)
* "D" or "date_desc": Sort by date in descending order
* "n" or "name": Sort by account name in ascending order
* "N" or "name_desc": Sort by account name in descending order
* "a" or "amount": Sort by posting amount in ascending order
* "A" or "amount_desc": Sort by posting amount in descending order
## Price-db
It is used to specify the currency in which the command output will be converted to.
```
$   ledger <command> -p <valid currency>
```
The ``-p`` flag is used to indicate that the following argument is the currency to be used by the command operation.

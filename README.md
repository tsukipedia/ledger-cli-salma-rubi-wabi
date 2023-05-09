# Running this
I know this isn't a good practice but to run this you will have to un-compress the node_modules.zip file contents into a folder named node_modules in your local directory. I did it this way because git sometimes doesn't allow me to connect my local repos to my remote repos, so I can only use github web to add stuff in my remote repo. I have tried to fix this but I can't, and whenever I ask for help it magically starts working so we can't troubleshoot, sorry :c

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

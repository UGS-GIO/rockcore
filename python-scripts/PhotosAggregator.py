#More information on this script at: https://docs.google.com/document/d/1kY1zvlhX77TNxgnPWpkP0G2-9eoDJK7OS9H6TqBqhwU/edit?usp=sharing and on the wiki page - database documentation- on rockcore github 



import arcpy
from collections import defaultdict
arcpy.env.overwriteOutput = True
arcpy.env.workspace = r"Database Connections\sde@rockcore.nrwugspgressp.sde"
fcPath = r"C:\Users\marthajensen\AppData\Roaming\ESRI\Desktop10.7\ArcCatalog\sde@rockcore.nrwugspgressp.sde\well_records"
relatedTblPath= r"C:\Users\marthajensen\AppData\Roaming\ESRI\Desktop10.7\ArcCatalog\sde@rockcore.nrwugspgressp.sde\photographs"


#relTblFields = ["UWI", "TYPE"]
#relTblFields = ["UWI", "Photographs"]
tblFields = ["UWI"]
dict_RelTbl = defaultdict(list)
joinID = []
#dict_RelTbl = {} #Look up dictionary
#Loop through related table and store only the max date for each unique ID.
with arcpy.da.SearchCursor(relatedTblPath, tblFields) as cursor:
    for row in cursor:

        joinID.append(row[0])



with arcpy.da.UpdateCursor(fcPath, ["UWI", "Photographs"]) as cursor:
    for row in cursor:

        uwiID = row[0]

        if uwiID in joinID:
            row[1] = "YES"
        else:
            row[1] = "NO"
        print(row[1])
        cursor.updateRow(row)

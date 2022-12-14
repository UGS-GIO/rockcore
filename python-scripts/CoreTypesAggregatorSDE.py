#More information on this script at: https://docs.google.com/document/d/1kY1zvlhX77TNxgnPWpkP0G2-9eoDJK7OS9H6TqBqhwU/edit?usp=sharing and on the wiki page - database documentation- on rockcore github 


import arcpy
import os
from collections import defaultdict





arcpy.env.workspace = r"Database Connections\sde@rockcore.nrwugspgressp.sde"
fcPath = r"C:\Users\marthajensen\AppData\Roaming\ESRI\Desktop10.7\ArcCatalog\sde@rockcore.nrwugspgressp.sde\well_records"
relatedTblPath= r"C:\Users\marthajensen\AppData\Roaming\ESRI\Desktop10.7\ArcCatalog\sde@rockcore.nrwugspgressp.sde\inventory"

##edit=arcpy.da.Editor(arcpy.env.workspace)
##edit.startEditing(False, True)
##edit.startOperation()
##workspace=os.path.dirname(fcPath)

relTblFields = ["uwi", "type"]
dict_RelTbl = defaultdict(list)
#Loop through related table and store only the max date for each unique ID.
with arcpy.da.SearchCursor(relatedTblPath, relTblFields) as cursor:
    for row in cursor:
        joinID = row[0]
        typeID = row[1]


        if typeID not in dict_RelTbl[joinID]:
        #print(dict_RelTbl[joinID])
            dict_RelTbl[joinID].append(row[1])

with arcpy.da.UpdateCursor(fcPath, ["uwi", "all_types"]) as cursor:
    for row in cursor:
        joinID = row[0]
        relatedRecord = ','.join(dict_RelTbl[joinID])
        row[1] = relatedRecord
        print(row[1])
        cursor.updateRow(row)

##edit.stopOperation()
##edit.stopEditing(True)
import arcpy
from collections import defaultdict
fcPath = r"\\168.180.168.181\geology\html\apps\rockcore\map\AGOL map.gdb\Well_Records"
relatedTblPath = r"\\168.180.168.181\geology\html\apps\rockcore\map\AGOL map.gdb\Inventory"

relTblFields = ["UWI", "Type"]
dict_RelTbl = defaultdict(list)
#Loop through related table and store only the max date for each unique ID.
with arcpy.da.SearchCursor(relatedTblPath, relTblFields) as cursor:
    for row in cursor:
        joinID = row[0]
        typeID = row[1]


        if typeID not in dict_RelTbl[joinID]:
        #print(dict_RelTbl[joinID])
            dict_RelTbl[joinID].append(row[1])

with arcpy.da.UpdateCursor(fcPath, ["UWI", "All_Types"]) as cursor:
    for row in cursor:
        joinID = row[0]
        relatedRecord = ','.join(dict_RelTbl[joinID])
        row[1] = relatedRecord
        print(row[1])
        cursor.updateRow(row)

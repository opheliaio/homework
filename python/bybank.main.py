import os
import csv
bybank_csv_path = os.path.join(".","budget_data_1.csv")
print (bybank_csv_path)
date = []
revenue = []
with open(bybank_csv_path,newline="") as csvfile:
    csv_reader =csv.reader(csvfile,delimiter=",")
    for data in csv_reader:
        if(data[0] != 'Date'):
            date.append(data[0])
            revenue.append(int(data[1]))
    print(len(date))
    print(sum(revenue))
    change_list = []
    total_month = len(date)
    index = 0
    for x in range (len(revenue) - 1):
        change_list.append(revenue[index+1]-revenue[index])
        index = index + 1
    print(sum(change_list)/total_month)
#Average_revenue_change = (change_list)
# /total_month
    Max_change = max(change_list)
    Min_change = min(change_list)
    print(max(change_list))
    print(min(change_list))
    for date in csv_reader:
        if(revenue == max(change_list)):
            print ("date")
    print("Financial Analysis")
    print("----------------------------") 
    print("Total Months:" + str(total_month))
    print("Total Revenue:" + str(sum(revenue)))
    print("Average Revenue Change: " + str(sum(change_list)/total_month))
    print("Greatest Increase in Revenue:" + date[change_list.index(Max_change)] + " " + str(max(change_list)))
    print("Greatest Decrease in Revenue:" + date[change_list.index(Min_change)] + " " + str(min(change_list)))

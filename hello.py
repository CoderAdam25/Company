name = ["Alice", "Bob", "Charlie"]
age = [25, 30, 35]
print("Hello, World!")
print(name)
print(age)

name.append("David")
age.append(40)

print("Updated names:", name)
print("Updated ages:", age)
print(name[1], "is", age[1], "years old.")

name.append(input("Enter a new name: "))
age.append(input("Enter the new person's age: "))

print("Updated names:", name)
print("Updated ages:", age)

print(name[4], "is", age[4], "years old.")

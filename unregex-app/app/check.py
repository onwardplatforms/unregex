import re

# Sample text
text = '''Jane's email: jane.doe@gmail.com
Bob's phone number: 555-123-4567
Email support: support@example.com
Steve's Twitter: @Steve123
Website: http://www.example.com
Timestamp: 2021-09-12 10:15:23
Lorem ipsum: 1234567890
Usernames: user_123, superUser, Admin_99
Hex Codes: #FF5733, #33FF57, #3357FF
Stocks: AAPL, TSLA, GOOGL
Temperature: 75°F, 25°C
Dates: 02/05/2020, 2020-05-02, May 2, 2020
Credit Card: 4111-1111-1111-1111
IP Address: 192.168.1.1, 10.0.0.1
Expressions: x^2, x+2=0, x-2y+z=3
Special Characters: &, %, $, @, !, <, >, {, }
Code snippets: for(i=0; i<10; i++) {console.log(i);}
'''

# Regex pattern
regex_pattern = r'\d{3}-\d{3}-\d{4}'

# Find phone numbers
phone_numbers = re.findall(regex_pattern, text)

# Print the results
print(phone_numbers)
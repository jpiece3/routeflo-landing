# Data Transformation Cookbook

Practical recipes for common data manipulation tasks in Gumloop workflows. Each recipe includes input/output examples and Gumloop-specific implementation guidance.

---

## How to Use This Cookbook

1. **Find your scenario** in the categories below
2. **Copy the transformation logic** and adapt to your data structure
3. **Test with sample data** before deploying to production
4. **Handle edge cases** (null values, empty arrays, unexpected types)

**Categories:**
- JSON Parsing & Construction
- Array Operations
- String Manipulation
- Date & Time Handling
- Conditional Logic
- Data Validation
- Data Merging & Combining
- Number & Math Operations

---

## JSON Parsing & Construction

### Recipe 1: Parse JSON String to Object

**Use Case:** Convert JSON string from webhook/API to usable object

**Input:**
```
json_string: '{"name": "John", "age": 30, "city": "NYC"}'
```

**Transform:**
```javascript
JSON.parse(json_string)
```

**Output:**
```
{
  name: "John",
  age: 30,
  city: "NYC"
}
```

**Gumloop Implementation:**
- Use "Parse JSON" node or JavaScript transform
- Handle parse errors with try/catch

**Edge Cases:**
- Invalid JSON → returns error (wrap in try/catch)
- Empty string → returns error
- Already an object → no need to parse

---

### Recipe 2: Convert Object to JSON String

**Use Case:** Prepare data for API request or storage

**Input:**
```
data: {
  user: "john@example.com",
  action: "purchase",
  amount: 99.99
}
```

**Transform:**
```javascript
JSON.stringify(data)
```

**Output:**
```
'{"user":"john@example.com","action":"purchase","amount":99.99}'
```

**Gumloop Implementation:**
- Use JavaScript transform with JSON.stringify()
- For pretty-print: `JSON.stringify(data, null, 2)`

---

### Recipe 3: Extract Nested Field from JSON

**Use Case:** Get specific value from deeply nested object

**Input:**
```
data: {
  customer: {
    profile: {
      contact: {
        email: "john@example.com"
      }
    }
  }
}
```

**Transform:**
```javascript
data.customer?.profile?.contact?.email || "default@example.com"
```

**Output:**
```
"john@example.com"
```

**Gumloop Implementation:**
- Use optional chaining (?.) to prevent errors
- Provide fallback value with || operator

**Edge Cases:**
- Missing intermediate keys → returns undefined (use optional chaining)
- Null values → returns null (provide fallback)

---

### Recipe 4: Flatten Nested JSON

**Use Case:** Convert nested object to flat structure

**Input:**
```
{
  user: {
    name: "John",
    contact: {
      email: "john@example.com",
      phone: "555-0100"
    }
  }
}
```

**Transform:**
```javascript
{
  "user_name": data.user.name,
  "user_email": data.user.contact.email,
  "user_phone": data.user.contact.phone
}
```

**Output:**
```
{
  user_name: "John",
  user_email: "john@example.com",
  user_phone: "555-0100"
}
```

**Gumloop Implementation:**
- Manually map each field
- Or use library like flat.js if available

---

## Array Operations

### Recipe 5: Filter Array by Condition

**Use Case:** Get subset of array matching criteria

**Input:**
```
orders: [
  {id: 1, amount: 50, status: "paid"},
  {id: 2, amount: 150, status: "paid"},
  {id: 3, amount: 75, status: "pending"}
]
```

**Transform:**
```javascript
orders.filter(order => order.status === "paid" && order.amount > 100)
```

**Output:**
```
[{id: 2, amount: 150, status: "paid"}]
```

**Gumloop Implementation:**
- Use JavaScript transform with .filter()
- Can chain multiple conditions

---

### Recipe 6: Map Array to Transform Each Item

**Use Case:** Transform each item in array to new structure

**Input:**
```
contacts: [
  {first: "John", last: "Doe", email: "john@example.com"},
  {first: "Jane", last: "Smith", email: "jane@example.com"}
]
```

**Transform:**
```javascript
contacts.map(contact => ({
  full_name: `${contact.first} ${contact.last}`,
  email: contact.email.toLowerCase()
}))
```

**Output:**
```
[
  {full_name: "John Doe", email: "john@example.com"},
  {full_name: "Jane Smith", email: "jane@example.com"}
]
```

**Gumloop Implementation:**
- Use .map() in JavaScript transform
- Return new object structure for each item

---

### Recipe 7: Reduce Array to Single Value

**Use Case:** Sum values, count items, aggregate data

**Input:**
```
orders: [
  {id: 1, amount: 50},
  {id: 2, amount: 150},
  {id: 3, amount: 75}
]
```

**Transform:**
```javascript
orders.reduce((total, order) => total + order.amount, 0)
```

**Output:**
```
275
```

**Gumloop Implementation:**
- Use .reduce() with accumulator and initial value
- Can build objects, arrays, or calculate totals

---

### Recipe 8: Find First Matching Item

**Use Case:** Get single item from array matching condition

**Input:**
```
users: [
  {id: 1, email: "john@example.com", role: "user"},
  {id: 2, email: "admin@example.com", role: "admin"}
]
```

**Transform:**
```javascript
users.find(user => user.role === "admin")
```

**Output:**
```
{id: 2, email: "admin@example.com", role: "admin"}
```

**Gumloop Implementation:**
- Use .find() to get first match
- Returns undefined if no match (check result)

---

### Recipe 9: Sort Array

**Use Case:** Order items by field value

**Input:**
```
products: [
  {name: "Widget", price: 25},
  {name: "Gadget", price: 50},
  {name: "Tool", price: 15}
]
```

**Transform:**
```javascript
products.sort((a, b) => a.price - b.price)
```

**Output:**
```
[
  {name: "Tool", price: 15},
  {name: "Widget", price: 25},
  {name: "Gadget", price: 50}
]
```

**Gumloop Implementation:**
- Use .sort() with comparator function
- Ascending: `a - b`, Descending: `b - a`
- For strings: `a.name.localeCompare(b.name)`

---

### Recipe 10: Remove Duplicates from Array

**Use Case:** Get unique values from array

**Input:**
```
tags: ["marketing", "sales", "marketing", "product", "sales"]
```

**Transform:**
```javascript
[...new Set(tags)]
```

**Output:**
```
["marketing", "sales", "product"]
```

**Gumloop Implementation:**
- Use Set to remove duplicates, spread to array
- Works for primitive values (strings, numbers)

---

### Recipe 11: Group Array by Property

**Use Case:** Organize items into groups

**Input:**
```
orders: [
  {id: 1, customer: "john", amount: 50},
  {id: 2, customer: "jane", amount: 75},
  {id: 3, customer: "john", amount: 100}
]
```

**Transform:**
```javascript
orders.reduce((groups, order) => {
  const customer = order.customer;
  if (!groups[customer]) groups[customer] = [];
  groups[customer].push(order);
  return groups;
}, {})
```

**Output:**
```
{
  john: [
    {id: 1, customer: "john", amount: 50},
    {id: 3, customer: "john", amount: 100}
  ],
  jane: [
    {id: 2, customer: "jane", amount: 75}
  ]
}
```

**Gumloop Implementation:**
- Use .reduce() to build grouped object
- Initialize empty object as accumulator

---

### Recipe 12: Chunk Array into Batches

**Use Case:** Split large array into smaller batches for processing

**Input:**
```
items: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
batch_size: 3
```

**Transform:**
```javascript
const batches = [];
for (let i = 0; i < items.length; i += batch_size) {
  batches.push(items.slice(i, i + batch_size));
}
return batches;
```

**Output:**
```
[[1, 2, 3], [4, 5, 6], [7, 8, 9], [10]]
```

**Gumloop Implementation:**
- Use loop to slice array into chunks
- Useful for rate-limited API calls

---

## String Manipulation

### Recipe 13: Extract Email Domain

**Use Case:** Get domain from email address

**Input:**
```
email: "john@acme-corp.com"
```

**Transform:**
```javascript
email.split('@')[1]
```

**Output:**
```
"acme-corp.com"
```

**Gumloop Implementation:**
- Split by @ and take second part
- Validate email format first

**Edge Cases:**
- No @ symbol → error (validate first)
- Multiple @ symbols → takes last part

---

### Recipe 14: Title Case / Capitalize Words

**Use Case:** Format names or titles properly

**Input:**
```
name: "john doe"
```

**Transform:**
```javascript
name.split(' ')
  .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
  .join(' ')
```

**Output:**
```
"John Doe"
```

**Gumloop Implementation:**
- Split by space, capitalize each word, rejoin

---

### Recipe 15: Trim & Clean Whitespace

**Use Case:** Remove extra spaces from user input

**Input:**
```
text: "  Hello   World  "
```

**Transform:**
```javascript
text.trim().replace(/\s+/g, ' ')
```

**Output:**
```
"Hello World"
```

**Gumloop Implementation:**
- .trim() removes leading/trailing spaces
- Replace multiple spaces with single space

---

### Recipe 16: Replace Text

**Use Case:** Find and replace in string

**Input:**
```
message: "Hello {name}, welcome to {company}!"
data: {name: "John", company: "Acme Corp"}
```

**Transform:**
```javascript
message
  .replace('{name}', data.name)
  .replace('{company}', data.company)
```

**Output:**
```
"Hello John, welcome to Acme Corp!"
```

**Gumloop Implementation:**
- Use .replace() for each placeholder
- For multiple: use .replaceAll() or regex

---

### Recipe 17: Extract Number from String

**Use Case:** Parse numeric value from text

**Input:**
```
text: "Price: $99.99"
```

**Transform:**
```javascript
parseFloat(text.match(/[\d\.]+/)[0])
```

**Output:**
```
99.99
```

**Gumloop Implementation:**
- Use regex to find number pattern
- parseFloat() to convert to number

**Edge Cases:**
- No number found → error (check match exists)
- Multiple numbers → takes first

---

### Recipe 18: Truncate Long Text

**Use Case:** Shorten text with ellipsis

**Input:**
```
text: "This is a very long description that needs to be shortened"
max_length: 30
```

**Transform:**
```javascript
text.length > max_length
  ? text.slice(0, max_length) + '...'
  : text
```

**Output:**
```
"This is a very long descrip..."
```

**Gumloop Implementation:**
- Check length, slice if needed
- Add ellipsis to indicate truncation

---

### Recipe 19: Slugify Text (URL-friendly)

**Use Case:** Convert text to URL-safe slug

**Input:**
```
title: "How to Build Gumloop Workflows"
```

**Transform:**
```javascript
title
  .toLowerCase()
  .replace(/[^a-z0-9]+/g, '-')
  .replace(/^-+|-+$/g, '')
```

**Output:**
```
"how-to-build-gumloop-workflows"
```

**Gumloop Implementation:**
- Lowercase, replace non-alphanumeric with hyphens
- Remove leading/trailing hyphens

---

### Recipe 20: Check if String Contains Substring

**Use Case:** Validate or filter based on content

**Input:**
```
subject: "URGENT: Action Required"
```

**Transform:**
```javascript
subject.toLowerCase().includes('urgent')
```

**Output:**
```
true
```

**Gumloop Implementation:**
- Use .includes() for case-insensitive check
- Can also use .indexOf() !== -1

---

## Date & Time Handling

### Recipe 21: Parse Date String

**Use Case:** Convert date string to Date object

**Input:**
```
date_str: "2025-01-02"
```

**Transform:**
```javascript
new Date(date_str)
```

**Output:**
```
Date object: 2025-01-02T00:00:00.000Z
```

**Gumloop Implementation:**
- Use new Date() constructor
- Supports ISO 8601 format

**Edge Cases:**
- Invalid date string → Invalid Date object
- Timezone handling (UTC vs local)

---

### Recipe 22: Format Date as String

**Use Case:** Display date in specific format

**Input:**
```
date: new Date("2025-01-02T10:30:00Z")
```

**Transform:**
```javascript
date.toISOString().split('T')[0] // YYYY-MM-DD
// or
date.toLocaleDateString('en-US') // 1/2/2025
```

**Output:**
```
"2025-01-02"
or
"1/2/2025"
```

**Gumloop Implementation:**
- toISOString() for ISO format
- toLocaleDateString() for localized format

---

### Recipe 23: Calculate Date Difference (Days)

**Use Case:** Find how many days between two dates

**Input:**
```
start_date: new Date("2025-01-01")
end_date: new Date("2025-01-15")
```

**Transform:**
```javascript
Math.floor((end_date - start_date) / (1000 * 60 * 60 * 24))
```

**Output:**
```
14
```

**Gumloop Implementation:**
- Subtract dates (gets milliseconds)
- Divide by ms per day, floor to integer

---

### Recipe 24: Add Days to Date

**Use Case:** Calculate future date

**Input:**
```
date: new Date("2025-01-02")
days_to_add: 7
```

**Transform:**
```javascript
const result = new Date(date);
result.setDate(result.getDate() + days_to_add);
return result;
```

**Output:**
```
Date object: 2025-01-09
```

**Gumloop Implementation:**
- Create copy of date
- Use setDate() to modify

---

### Recipe 25: Get Current Timestamp

**Use Case:** Record when event occurred

**Input:**
```
(no input needed)
```

**Transform:**
```javascript
new Date().toISOString()
// or for Unix timestamp:
Date.now()
```

**Output:**
```
"2025-01-02T15:30:00.000Z"
or
1735831800000
```

**Gumloop Implementation:**
- toISOString() for readable format
- Date.now() for numeric timestamp

---

### Recipe 26: Extract Date Components

**Use Case:** Get year, month, day separately

**Input:**
```
date: new Date("2025-01-02T10:30:00Z")
```

**Transform:**
```javascript
{
  year: date.getFullYear(),
  month: date.getMonth() + 1, // 0-indexed, add 1
  day: date.getDate(),
  hour: date.getHours(),
  minute: date.getMinutes()
}
```

**Output:**
```
{
  year: 2025,
  month: 1,
  day: 2,
  hour: 10,
  minute: 30
}
```

**Gumloop Implementation:**
- Use Date getter methods
- Remember month is 0-indexed (January = 0)

---

## Conditional Logic

### Recipe 27: If-Then-Else Logic

**Use Case:** Route data based on condition

**Input:**
```
order: {
  amount: 150,
  customer_tier: "enterprise"
}
```

**Transform:**
```javascript
const priority = order.amount > 100 && order.customer_tier === "enterprise"
  ? "high"
  : order.amount > 100
    ? "medium"
    : "low";
```

**Output:**
```
"high"
```

**Gumloop Implementation:**
- Use ternary operator for inline conditionals
- Can nest for multiple conditions

---

### Recipe 28: Switch-Case Logic

**Use Case:** Map value to different outputs

**Input:**
```
status: "paid"
```

**Transform:**
```javascript
const messages = {
  "paid": "Payment successful",
  "pending": "Payment processing",
  "failed": "Payment failed"
};
return messages[status] || "Unknown status";
```

**Output:**
```
"Payment successful"
```

**Gumloop Implementation:**
- Use object lookup instead of switch
- Provide default value with ||

---

### Recipe 29: Null/Undefined Handling

**Use Case:** Provide default values for missing data

**Input:**
```
user: {
  name: "John",
  email: null,
  phone: undefined
}
```

**Transform:**
```javascript
{
  name: user.name || "Unknown",
  email: user.email ?? "no-email@example.com",
  phone: user.phone ?? "No phone provided"
}
```

**Output:**
```
{
  name: "John",
  email: "no-email@example.com",
  phone: "No phone provided"
}
```

**Gumloop Implementation:**
- Use ?? (nullish coalescing) for null/undefined
- Use || for falsy values (including empty string, 0)

---

## Data Validation

### Recipe 30: Validate Email Format

**Use Case:** Check if email is valid before processing

**Input:**
```
email: "john@example.com"
```

**Transform:**
```javascript
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const isValid = emailRegex.test(email);
```

**Output:**
```
true
```

**Gumloop Implementation:**
- Use regex pattern for email validation
- Basic validation (not RFC-compliant)

---

### Recipe 31: Validate Required Fields

**Use Case:** Ensure all necessary fields present

**Input:**
```
data: {
  name: "John",
  email: "john@example.com",
  phone: null
}
required_fields: ["name", "email"]
```

**Transform:**
```javascript
const missing = required_fields.filter(field => !data[field]);
const isValid = missing.length === 0;
```

**Output:**
```
isValid: true
missing: []
```

**Gumloop Implementation:**
- Filter for fields that are falsy
- Check if any missing

---

### Recipe 32: Validate Number Range

**Use Case:** Ensure value within acceptable range

**Input:**
```
quantity: 5
min: 1
max: 10
```

**Transform:**
```javascript
const isValid = quantity >= min && quantity <= max;
```

**Output:**
```
true
```

**Gumloop Implementation:**
- Simple comparison operators
- Can add error messages for invalid

---

### Recipe 33: Validate Data Type

**Use Case:** Ensure value is expected type

**Input:**
```
value: "123"
expected_type: "string"
```

**Transform:**
```javascript
typeof value === expected_type
// For arrays:
Array.isArray(value)
```

**Output:**
```
true
```

**Gumloop Implementation:**
- Use typeof for primitives
- Array.isArray() for arrays

---

## Data Merging & Combining

### Recipe 34: Merge Two Objects

**Use Case:** Combine data from multiple sources

**Input:**
```
user: {id: 1, name: "John"}
extra: {email: "john@example.com", role: "admin"}
```

**Transform:**
```javascript
{...user, ...extra}
```

**Output:**
```
{
  id: 1,
  name: "John",
  email: "john@example.com",
  role: "admin"
}
```

**Gumloop Implementation:**
- Use spread operator to merge
- Later properties override earlier ones

---

### Recipe 35: Concatenate Arrays

**Use Case:** Combine multiple arrays into one

**Input:**
```
arr1: [1, 2, 3]
arr2: [4, 5, 6]
```

**Transform:**
```javascript
[...arr1, ...arr2]
// or
arr1.concat(arr2)
```

**Output:**
```
[1, 2, 3, 4, 5, 6]
```

**Gumloop Implementation:**
- Spread operator or .concat()
- Both create new array (immutable)

---

### Recipe 36: Join Array to String

**Use Case:** Create comma-separated list

**Input:**
```
tags: ["javascript", "automation", "workflow"]
```

**Transform:**
```javascript
tags.join(', ')
```

**Output:**
```
"javascript, automation, workflow"
```

**Gumloop Implementation:**
- Use .join() with separator
- Can use any separator (comma, space, newline)

---

### Recipe 37: Deep Clone Object

**Use Case:** Create independent copy of nested object

**Input:**
```
original: {
  user: {name: "John", details: {age: 30}}
}
```

**Transform:**
```javascript
JSON.parse(JSON.stringify(original))
```

**Output:**
```
{
  user: {name: "John", details: {age: 30}}
}
```

**Gumloop Implementation:**
- JSON stringify/parse for deep clone
- Doesn't work with functions, dates (converts to string)

---

## Number & Math Operations

### Recipe 38: Round Number

**Use Case:** Round to specific decimal places

**Input:**
```
number: 99.9876
decimals: 2
```

**Transform:**
```javascript
Math.round(number * 100) / 100
// or
number.toFixed(2)
```

**Output:**
```
99.99
```

**Gumloop Implementation:**
- Math.round() with multiplier
- toFixed() returns string

---

### Recipe 39: Calculate Percentage

**Use Case:** Find percentage of total

**Input:**
```
part: 25
total: 200
```

**Transform:**
```javascript
(part / total) * 100
```

**Output:**
```
12.5
```

**Gumloop Implementation:**
- Simple division and multiplication
- Round if needed

---

### Recipe 40: Generate Random Number

**Use Case:** Create random ID or select random item

**Input:**
```
min: 1000
max: 9999
```

**Transform:**
```javascript
Math.floor(Math.random() * (max - min + 1)) + min
```

**Output:**
```
7342 (example)
```

**Gumloop Implementation:**
- Math.random() gives 0-1
- Scale to range and floor

---

## Advanced Transformations

### Recipe 41: Deduplicate Objects by Property

**Use Case:** Remove duplicate items based on specific field

**Input:**
```
contacts: [
  {id: 1, email: "john@example.com", name: "John"},
  {id: 2, email: "jane@example.com", name: "Jane"},
  {id: 3, email: "john@example.com", name: "John Doe"}
]
```

**Transform:**
```javascript
const seen = new Set();
contacts.filter(contact => {
  if (seen.has(contact.email)) return false;
  seen.add(contact.email);
  return true;
});
```

**Output:**
```
[
  {id: 1, email: "john@example.com", name: "John"},
  {id: 2, email: "jane@example.com", name: "Jane"}
]
```

**Gumloop Implementation:**
- Use Set to track seen values
- Filter keeps first occurrence

---

### Recipe 42: Pivot Array of Objects

**Use Case:** Convert row-based data to key-value pairs

**Input:**
```
data: [
  {metric: "revenue", value: 10000},
  {metric: "users", value: 500}
]
```

**Transform:**
```javascript
data.reduce((obj, item) => {
  obj[item.metric] = item.value;
  return obj;
}, {})
```

**Output:**
```
{
  revenue: 10000,
  users: 500
}
```

**Gumloop Implementation:**
- Use reduce to build object
- Key from one field, value from another

---

These 42 recipes cover the most common data transformation scenarios in Gumloop workflows. Remember to:
- **Test with real data** before deploying
- **Handle edge cases** (null, undefined, empty arrays)
- **Validate inputs** to prevent errors
- **Log transformations** for debugging

For more complex transformations, consider breaking into multiple steps or using specialized nodes in Gumloop.

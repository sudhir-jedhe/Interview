function maskPII(S) {
    if (S.includes('@')) {
        // Mask email
        let atIndex = S.indexOf('@');
        let name1 = S.slice(0, atIndex).toLowerCase();
        let name3 = S.slice(atIndex + 1).toLowerCase();
        
        // Mask name1
        let maskedName1 = name1[0] + '*****' + name1[name1.length - 1];
        
        return maskedName1 + '@' + name3;
    } else {
        // Mask phone number
        let digits = S.replace(/\D/g, ''); // Remove non-digits
        let localNumber = digits.slice(-10);
        let maskedLocal = '***-***-' + localNumber.slice(-4);
        
        if (digits.length === 10) {
            return maskedLocal;
        } else {
            let countryDigits = digits.length - 10;
            let maskedCountry = '+';
            for (let i = 0; i < countryDigits; i++) {
                maskedCountry += '*';
            }
            return maskedCountry + '-' + maskedLocal;
        }
    }
}


/********************************** */

function maskPersonalInfo(info) {
    const emailRegex = /^[a-zA-Z]+@[a-zA-Z]+\.[a-zA-Z]+$/;
  
    if (emailRegex.test(info)) { // Check if it's an email
      const parts = info.split('@');
      const maskedName = parts[0].charAt(0) + '*'.repeat(parts[0].length - 2) + parts[0].charAt(parts[0].length - 1);
      return maskedName.toLowerCase() + '@' + parts[1].toLowerCase();
    } else { // Phone number
      const digits = info.replace(/\D/g, ''); // Remove non-digits
      if (digits.length < 10 || digits.length > 13) {
        return 'Invalid phone number'; // Handle invalid lengths
      }
  
      let mask = '';
      if (digits.length > 10) { // Has country code
        mask += '+' + '*'.repeat(digits.length - 10) + '-';
      }
  
      mask += '-'.repeat(Math.floor((digits.length - 4) / 3)) + '***-' + digits.slice(-4);
      return mask;
    }
  }
  
  // Examples
  console.log(maskPersonalInfo('user@example.com')); // Output: user*****@example.com
  console.log(maskPersonalInfo('+1 123 456 7890')); // Output: +***-***-***-7890
  console.log(maskPersonalInfo('123 Main St')); // Output: Invalid phone number
  console.log(maskPersonalInfo('(555) 555-5555')); // Output: --555-5555
  
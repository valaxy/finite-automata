function lexer (input) {
  var s = 0
    , a = [2, 3]
    , i = 0
    , ii = input.length
    , c = ' '
    , m = 0
    , r = []
  for (; i<ii; ++i) {
    c = input.charAt(i)
    switch (s) {
      case 0:
        switch (c) {
          case 'b': s = 1; break
          case 's': s = 11; break
          case 'c': s = 18; break
          case 'w': s = 8; break
          case 'y': s = 7; break
          case 'v': s = 9; break
          case 'e': s = 16; break
          case 't': s = 10; break
          case 'd': s = 17; break
          case 'f': s = 15; break
          case 'n': s = 5; break
          case 'i': s = 12; break
          case 'l': s = 4; break
          case 'r': s = 6; break
          default:
          if (a.indexOf(s) >= 0) {
            // Append the matched token
            r.push(input.slice(m, i))
          }
          s = 0
          m = i + 1
        }
      break
      case 1:
        switch (c) {
          case 'r': s = 19; break
          default:
          if (a.indexOf(s) >= 0) {
            // Append the matched token
            r.push(input.slice(m, i))
          }
          s = 0
          i = i - 1
          m = i + 1
        }
      break
      case 2:
        switch (c) {
          default:
          if (a.indexOf(s) >= 0) {
            // Append the matched token
            r.push(input.slice(m, i))
          }
          s = 0
          i = i - 1
          m = i + 1
        }
      break
      case 3:
        switch (c) {
          case 's': s = 51; break
          default:
          if (a.indexOf(s) >= 0) {
            // Append the matched token
            r.push(input.slice(m, i))
          }
          s = 0
          i = i - 1
          m = i + 1
        }
      break
      case 4:
        switch (c) {
          case 'e': s = 34; break
          default:
          if (a.indexOf(s) >= 0) {
            // Append the matched token
            r.push(input.slice(m, i))
          }
          s = 0
          i = i - 1
          m = i + 1
        }
      break
      case 5:
        switch (c) {
          case 'e': s = 33; break
          default:
          if (a.indexOf(s) >= 0) {
            // Append the matched token
            r.push(input.slice(m, i))
          }
          s = 0
          i = i - 1
          m = i + 1
        }
      break
      case 6:
        switch (c) {
          case 'e': s = 23; break
          default:
          if (a.indexOf(s) >= 0) {
            // Append the matched token
            r.push(input.slice(m, i))
          }
          s = 0
          i = i - 1
          m = i + 1
        }
      break
      case 7:
        switch (c) {
          case 'i': s = 30; break
          default:
          if (a.indexOf(s) >= 0) {
            // Append the matched token
            r.push(input.slice(m, i))
          }
          s = 0
          i = i - 1
          m = i + 1
        }
      break
      case 8:
        switch (c) {
          case 'i': s = 29; break
          case 'h': s = 28; break
          default:
          if (a.indexOf(s) >= 0) {
            // Append the matched token
            r.push(input.slice(m, i))
          }
          s = 0
          i = i - 1
          m = i + 1
        }
      break
      case 9:
        switch (c) {
          case 'o': s = 27; break
          case 'a': s = 37; break
          default:
          if (a.indexOf(s) >= 0) {
            // Append the matched token
            r.push(input.slice(m, i))
          }
          s = 0
          i = i - 1
          m = i + 1
        }
      break
      case 10:
        switch (c) {
          case 'h': s = 32; break
          case 'r': s = 31; break
          case 'y': s = 26; break
          default:
          if (a.indexOf(s) >= 0) {
            // Append the matched token
            r.push(input.slice(m, i))
          }
          s = 0
          i = i - 1
          m = i + 1
        }
      break
      case 11:
        switch (c) {
          case 'w': s = 25; break
          case 'u': s = 24; break
          default:
          if (a.indexOf(s) >= 0) {
            // Append the matched token
            r.push(input.slice(m, i))
          }
          s = 0
          i = i - 1
          m = i + 1
        }
      break
      case 12:
        switch (c) {
          case 'm': s = 35; break
          case 'n': s = 3; break
          case 'f': s = 2; break
          default:
          if (a.indexOf(s) >= 0) {
            // Append the matched token
            r.push(input.slice(m, i))
          }
          s = 0
          i = i - 1
          m = i + 1
        }
      break
      case 13:
        switch (c) {
          case 'f': s = 2; break
          default:
          if (a.indexOf(s) >= 0) {
            // Append the matched token
            r.push(input.slice(m, i))
          }
          s = 0
          i = i - 1
          m = i + 1
        }
      break
      case 14:
        switch (c) {
          case 'n': s = 2; break
          default:
          if (a.indexOf(s) >= 0) {
            // Append the matched token
            r.push(input.slice(m, i))
          }
          s = 0
          i = i - 1
          m = i + 1
        }
      break
      case 15:
        switch (c) {
          case 'i': s = 21; break
          case 'o': s = 37; break
          case 'u': s = 22; break
          default:
          if (a.indexOf(s) >= 0) {
            // Append the matched token
            r.push(input.slice(m, i))
          }
          s = 0
          i = i - 1
          m = i + 1
        }
      break
      case 16:
        switch (c) {
          case 'x': s = 36; break
          case 'l': s = 38; break
          default:
          if (a.indexOf(s) >= 0) {
            // Append the matched token
            r.push(input.slice(m, i))
          }
          s = 0
          i = i - 1
          m = i + 1
        }
      break
      case 17:
        switch (c) {
          case 'o': s = 2; break
          case 'e': s = 40; break
          default:
          if (a.indexOf(s) >= 0) {
            // Append the matched token
            r.push(input.slice(m, i))
          }
          s = 0
          i = i - 1
          m = i + 1
        }
      break
      case 18:
        switch (c) {
          case 'a': s = 39; break
          case 'l': s = 20; break
          case 'o': s = 41; break
          default:
          if (a.indexOf(s) >= 0) {
            // Append the matched token
            r.push(input.slice(m, i))
          }
          s = 0
          i = i - 1
          m = i + 1
        }
      break
      case 19:
        switch (c) {
          case 'e': s = 43; break
          default:
          if (a.indexOf(s) >= 0) {
            // Append the matched token
            r.push(input.slice(m, i))
          }
          s = 0
          i = i - 1
          m = i + 1
        }
      break
      case 20:
        switch (c) {
          case 'a': s = 44; break
          default:
          if (a.indexOf(s) >= 0) {
            // Append the matched token
            r.push(input.slice(m, i))
          }
          s = 0
          i = i - 1
          m = i + 1
        }
      break
      case 21:
        switch (c) {
          case 'n': s = 49; break
          default:
          if (a.indexOf(s) >= 0) {
            // Append the matched token
            r.push(input.slice(m, i))
          }
          s = 0
          i = i - 1
          m = i + 1
        }
      break
      case 22:
        switch (c) {
          case 'n': s = 50; break
          default:
          if (a.indexOf(s) >= 0) {
            // Append the matched token
            r.push(input.slice(m, i))
          }
          s = 0
          i = i - 1
          m = i + 1
        }
      break
      case 23:
        switch (c) {
          case 't': s = 52; break
          default:
          if (a.indexOf(s) >= 0) {
            // Append the matched token
            r.push(input.slice(m, i))
          }
          s = 0
          i = i - 1
          m = i + 1
        }
      break
      case 24:
        switch (c) {
          case 'p': s = 60; break
          default:
          if (a.indexOf(s) >= 0) {
            // Append the matched token
            r.push(input.slice(m, i))
          }
          s = 0
          i = i - 1
          m = i + 1
        }
      break
      case 25:
        switch (c) {
          case 'i': s = 42; break
          default:
          if (a.indexOf(s) >= 0) {
            // Append the matched token
            r.push(input.slice(m, i))
          }
          s = 0
          i = i - 1
          m = i + 1
        }
      break
      case 26:
        switch (c) {
          case 'p': s = 58; break
          default:
          if (a.indexOf(s) >= 0) {
            // Append the matched token
            r.push(input.slice(m, i))
          }
          s = 0
          i = i - 1
          m = i + 1
        }
      break
      case 27:
        switch (c) {
          case 'i': s = 57; break
          default:
          if (a.indexOf(s) >= 0) {
            // Append the matched token
            r.push(input.slice(m, i))
          }
          s = 0
          i = i - 1
          m = i + 1
        }
      break
      case 28:
        switch (c) {
          case 'i': s = 54; break
          default:
          if (a.indexOf(s) >= 0) {
            // Append the matched token
            r.push(input.slice(m, i))
          }
          s = 0
          i = i - 1
          m = i + 1
        }
      break
      case 29:
        switch (c) {
          case 't': s = 56; break
          default:
          if (a.indexOf(s) >= 0) {
            // Append the matched token
            r.push(input.slice(m, i))
          }
          s = 0
          i = i - 1
          m = i + 1
        }
      break
      case 30:
        switch (c) {
          case 'e': s = 55; break
          default:
          if (a.indexOf(s) >= 0) {
            // Append the matched token
            r.push(input.slice(m, i))
          }
          s = 0
          i = i - 1
          m = i + 1
        }
      break
      case 31:
        switch (c) {
          case 'y': s = 2; break
          default:
          if (a.indexOf(s) >= 0) {
            // Append the matched token
            r.push(input.slice(m, i))
          }
          s = 0
          i = i - 1
          m = i + 1
        }
      break
      case 32:
        switch (c) {
          case 'i': s = 59; break
          case 'r': s = 53; break
          default:
          if (a.indexOf(s) >= 0) {
            // Append the matched token
            r.push(input.slice(m, i))
          }
          s = 0
          i = i - 1
          m = i + 1
        }
      break
      case 33:
        switch (c) {
          case 'w': s = 2; break
          default:
          if (a.indexOf(s) >= 0) {
            // Append the matched token
            r.push(input.slice(m, i))
          }
          s = 0
          i = i - 1
          m = i + 1
        }
      break
      case 34:
        switch (c) {
          case 't': s = 2; break
          default:
          if (a.indexOf(s) >= 0) {
            // Append the matched token
            r.push(input.slice(m, i))
          }
          s = 0
          i = i - 1
          m = i + 1
        }
      break
      case 35:
        switch (c) {
          case 'p': s = 61; break
          default:
          if (a.indexOf(s) >= 0) {
            // Append the matched token
            r.push(input.slice(m, i))
          }
          s = 0
          i = i - 1
          m = i + 1
        }
      break
      case 36:
        switch (c) {
          case 'p': s = 61; break
          case 't': s = 48; break
          default:
          if (a.indexOf(s) >= 0) {
            // Append the matched token
            r.push(input.slice(m, i))
          }
          s = 0
          i = i - 1
          m = i + 1
        }
      break
      case 37:
        switch (c) {
          case 'r': s = 2; break
          default:
          if (a.indexOf(s) >= 0) {
            // Append the matched token
            r.push(input.slice(m, i))
          }
          s = 0
          i = i - 1
          m = i + 1
        }
      break
      case 38:
        switch (c) {
          case 's': s = 64; break
          default:
          if (a.indexOf(s) >= 0) {
            // Append the matched token
            r.push(input.slice(m, i))
          }
          s = 0
          i = i - 1
          m = i + 1
        }
      break
      case 39:
        switch (c) {
          case 's': s = 64; break
          case 't': s = 63; break
          default:
          if (a.indexOf(s) >= 0) {
            // Append the matched token
            r.push(input.slice(m, i))
          }
          s = 0
          i = i - 1
          m = i + 1
        }
      break
      case 40:
        switch (c) {
          case 'l': s = 47; break
          case 'f': s = 46; break
          case 'b': s = 45; break
          default:
          if (a.indexOf(s) >= 0) {
            // Append the matched token
            r.push(input.slice(m, i))
          }
          s = 0
          i = i - 1
          m = i + 1
        }
      break
      case 41:
        switch (c) {
          case 'n': s = 62; break
          default:
          if (a.indexOf(s) >= 0) {
            // Append the matched token
            r.push(input.slice(m, i))
          }
          s = 0
          i = i - 1
          m = i + 1
        }
      break
      case 42:
        switch (c) {
          case 't': s = 63; break
          default:
          if (a.indexOf(s) >= 0) {
            // Append the matched token
            r.push(input.slice(m, i))
          }
          s = 0
          i = i - 1
          m = i + 1
        }
      break
      case 43:
        switch (c) {
          case 'a': s = 65; break
          default:
          if (a.indexOf(s) >= 0) {
            // Append the matched token
            r.push(input.slice(m, i))
          }
          s = 0
          i = i - 1
          m = i + 1
        }
      break
      case 44:
        switch (c) {
          case 's': s = 59; break
          default:
          if (a.indexOf(s) >= 0) {
            // Append the matched token
            r.push(input.slice(m, i))
          }
          s = 0
          i = i - 1
          m = i + 1
        }
      break
      case 45:
        switch (c) {
          case 'u': s = 67; break
          default:
          if (a.indexOf(s) >= 0) {
            // Append the matched token
            r.push(input.slice(m, i))
          }
          s = 0
          i = i - 1
          m = i + 1
        }
      break
      case 46:
        switch (c) {
          case 'a': s = 68; break
          default:
          if (a.indexOf(s) >= 0) {
            // Append the matched token
            r.push(input.slice(m, i))
          }
          s = 0
          i = i - 1
          m = i + 1
        }
      break
      case 47:
        switch (c) {
          case 'e': s = 69; break
          default:
          if (a.indexOf(s) >= 0) {
            // Append the matched token
            r.push(input.slice(m, i))
          }
          s = 0
          i = i - 1
          m = i + 1
        }
      break
      case 48:
        switch (c) {
          case 'e': s = 70; break
          default:
          if (a.indexOf(s) >= 0) {
            // Append the matched token
            r.push(input.slice(m, i))
          }
          s = 0
          i = i - 1
          m = i + 1
        }
      break
      case 49:
        switch (c) {
          case 'a': s = 71; break
          default:
          if (a.indexOf(s) >= 0) {
            // Append the matched token
            r.push(input.slice(m, i))
          }
          s = 0
          i = i - 1
          m = i + 1
        }
      break
      case 50:
        switch (c) {
          case 'c': s = 72; break
          default:
          if (a.indexOf(s) >= 0) {
            // Append the matched token
            r.push(input.slice(m, i))
          }
          s = 0
          i = i - 1
          m = i + 1
        }
      break
      case 51:
        switch (c) {
          case 't': s = 73; break
          default:
          if (a.indexOf(s) >= 0) {
            // Append the matched token
            r.push(input.slice(m, i))
          }
          s = 0
          i = i - 1
          m = i + 1
        }
      break
      case 52:
        switch (c) {
          case 'u': s = 74; break
          default:
          if (a.indexOf(s) >= 0) {
            // Append the matched token
            r.push(input.slice(m, i))
          }
          s = 0
          i = i - 1
          m = i + 1
        }
      break
      case 53:
        switch (c) {
          case 'o': s = 33; break
          default:
          if (a.indexOf(s) >= 0) {
            // Append the matched token
            r.push(input.slice(m, i))
          }
          s = 0
          i = i - 1
          m = i + 1
        }
      break
      case 54:
        switch (c) {
          case 'l': s = 64; break
          default:
          if (a.indexOf(s) >= 0) {
            // Append the matched token
            r.push(input.slice(m, i))
          }
          s = 0
          i = i - 1
          m = i + 1
        }
      break
      case 55:
        switch (c) {
          case 'l': s = 57; break
          default:
          if (a.indexOf(s) >= 0) {
            // Append the matched token
            r.push(input.slice(m, i))
          }
          s = 0
          i = i - 1
          m = i + 1
        }
      break
      case 56:
        switch (c) {
          case 'h': s = 2; break
          default:
          if (a.indexOf(s) >= 0) {
            // Append the matched token
            r.push(input.slice(m, i))
          }
          s = 0
          i = i - 1
          m = i + 1
        }
      break
      case 57:
        switch (c) {
          case 'd': s = 2; break
          default:
          if (a.indexOf(s) >= 0) {
            // Append the matched token
            r.push(input.slice(m, i))
          }
          s = 0
          i = i - 1
          m = i + 1
        }
      break
      case 58:
        switch (c) {
          case 'e': s = 75; break
          default:
          if (a.indexOf(s) >= 0) {
            // Append the matched token
            r.push(input.slice(m, i))
          }
          s = 0
          i = i - 1
          m = i + 1
        }
      break
      case 59:
        switch (c) {
          case 's': s = 2; break
          default:
          if (a.indexOf(s) >= 0) {
            // Append the matched token
            r.push(input.slice(m, i))
          }
          s = 0
          i = i - 1
          m = i + 1
        }
      break
      case 60:
        switch (c) {
          case 'e': s = 37; break
          default:
          if (a.indexOf(s) >= 0) {
            // Append the matched token
            r.push(input.slice(m, i))
          }
          s = 0
          i = i - 1
          m = i + 1
        }
      break
      case 61:
        switch (c) {
          case 'o': s = 76; break
          default:
          if (a.indexOf(s) >= 0) {
            // Append the matched token
            r.push(input.slice(m, i))
          }
          s = 0
          i = i - 1
          m = i + 1
        }
      break
      case 62:
        switch (c) {
          case 't': s = 66; break
          case 's': s = 34; break
          default:
          if (a.indexOf(s) >= 0) {
            // Append the matched token
            r.push(input.slice(m, i))
          }
          s = 0
          i = i - 1
          m = i + 1
        }
      break
      case 63:
        switch (c) {
          case 'c': s = 56; break
          default:
          if (a.indexOf(s) >= 0) {
            // Append the matched token
            r.push(input.slice(m, i))
          }
          s = 0
          i = i - 1
          m = i + 1
        }
      break
      case 64:
        switch (c) {
          case 'e': s = 2; break
          default:
          if (a.indexOf(s) >= 0) {
            // Append the matched token
            r.push(input.slice(m, i))
          }
          s = 0
          i = i - 1
          m = i + 1
        }
      break
      case 65:
        switch (c) {
          case 'k': s = 2; break
          default:
          if (a.indexOf(s) >= 0) {
            // Append the matched token
            r.push(input.slice(m, i))
          }
          s = 0
          i = i - 1
          m = i + 1
        }
      break
      case 66:
        switch (c) {
          case 'i': s = 77; break
          default:
          if (a.indexOf(s) >= 0) {
            // Append the matched token
            r.push(input.slice(m, i))
          }
          s = 0
          i = i - 1
          m = i + 1
        }
      break
      case 67:
        switch (c) {
          case 'g': s = 78; break
          default:
          if (a.indexOf(s) >= 0) {
            // Append the matched token
            r.push(input.slice(m, i))
          }
          s = 0
          i = i - 1
          m = i + 1
        }
      break
      case 68:
        switch (c) {
          case 'u': s = 79; break
          default:
          if (a.indexOf(s) >= 0) {
            // Append the matched token
            r.push(input.slice(m, i))
          }
          s = 0
          i = i - 1
          m = i + 1
        }
      break
      case 69:
        switch (c) {
          case 't': s = 64; break
          default:
          if (a.indexOf(s) >= 0) {
            // Append the matched token
            r.push(input.slice(m, i))
          }
          s = 0
          i = i - 1
          m = i + 1
        }
      break
      case 70:
        switch (c) {
          case 'n': s = 80; break
          default:
          if (a.indexOf(s) >= 0) {
            // Append the matched token
            r.push(input.slice(m, i))
          }
          s = 0
          i = i - 1
          m = i + 1
        }
      break
      case 71:
        switch (c) {
          case 'l': s = 81; break
          default:
          if (a.indexOf(s) >= 0) {
            // Append the matched token
            r.push(input.slice(m, i))
          }
          s = 0
          i = i - 1
          m = i + 1
        }
      break
      case 72:
        switch (c) {
          case 't': s = 82; break
          default:
          if (a.indexOf(s) >= 0) {
            // Append the matched token
            r.push(input.slice(m, i))
          }
          s = 0
          i = i - 1
          m = i + 1
        }
      break
      case 73:
        switch (c) {
          case 'a': s = 83; break
          default:
          if (a.indexOf(s) >= 0) {
            // Append the matched token
            r.push(input.slice(m, i))
          }
          s = 0
          i = i - 1
          m = i + 1
        }
      break
      case 74:
        switch (c) {
          case 'r': s = 14; break
          default:
          if (a.indexOf(s) >= 0) {
            // Append the matched token
            r.push(input.slice(m, i))
          }
          s = 0
          i = i - 1
          m = i + 1
        }
      break
      case 75:
        switch (c) {
          case 'o': s = 13; break
          default:
          if (a.indexOf(s) >= 0) {
            // Append the matched token
            r.push(input.slice(m, i))
          }
          s = 0
          i = i - 1
          m = i + 1
        }
      break
      case 76:
        switch (c) {
          case 'r': s = 34; break
          default:
          if (a.indexOf(s) >= 0) {
            // Append the matched token
            r.push(input.slice(m, i))
          }
          s = 0
          i = i - 1
          m = i + 1
        }
      break
      case 77:
        switch (c) {
          case 'n': s = 84; break
          default:
          if (a.indexOf(s) >= 0) {
            // Append the matched token
            r.push(input.slice(m, i))
          }
          s = 0
          i = i - 1
          m = i + 1
        }
      break
      case 78:
        switch (c) {
          case 'g': s = 60; break
          default:
          if (a.indexOf(s) >= 0) {
            // Append the matched token
            r.push(input.slice(m, i))
          }
          s = 0
          i = i - 1
          m = i + 1
        }
      break
      case 79:
        switch (c) {
          case 'l': s = 34; break
          default:
          if (a.indexOf(s) >= 0) {
            // Append the matched token
            r.push(input.slice(m, i))
          }
          s = 0
          i = i - 1
          m = i + 1
        }
      break
      case 80:
        switch (c) {
          case 'd': s = 59; break
          default:
          if (a.indexOf(s) >= 0) {
            // Append the matched token
            r.push(input.slice(m, i))
          }
          s = 0
          i = i - 1
          m = i + 1
        }
      break
      case 81:
        switch (c) {
          case 'l': s = 31; break
          default:
          if (a.indexOf(s) >= 0) {
            // Append the matched token
            r.push(input.slice(m, i))
          }
          s = 0
          i = i - 1
          m = i + 1
        }
      break
      case 82:
        switch (c) {
          case 'i': s = 85; break
          default:
          if (a.indexOf(s) >= 0) {
            // Append the matched token
            r.push(input.slice(m, i))
          }
          s = 0
          i = i - 1
          m = i + 1
        }
      break
      case 83:
        switch (c) {
          case 'n': s = 86; break
          default:
          if (a.indexOf(s) >= 0) {
            // Append the matched token
            r.push(input.slice(m, i))
          }
          s = 0
          i = i - 1
          m = i + 1
        }
      break
      case 84:
        switch (c) {
          case 'u': s = 64; break
          default:
          if (a.indexOf(s) >= 0) {
            // Append the matched token
            r.push(input.slice(m, i))
          }
          s = 0
          i = i - 1
          m = i + 1
        }
      break
      case 85:
        switch (c) {
          case 'o': s = 14; break
          default:
          if (a.indexOf(s) >= 0) {
            // Append the matched token
            r.push(input.slice(m, i))
          }
          s = 0
          i = i - 1
          m = i + 1
        }
      break
      case 86:
        switch (c) {
          case 'c': s = 58; break
          default:
          if (a.indexOf(s) >= 0) {
            // Append the matched token
            r.push(input.slice(m, i))
          }
          s = 0
          i = i - 1
          m = i + 1
        }
      break
    }
  }
  if (a.indexOf(s) >= 0) {
    // Append the matched token
    r.push(input.slice(m, i))
  }
  return r
}
;module.exports=lexer;
import typeDecoders from '../decode';

test('decodeTypeDctionary', () => {
  // Given
  const bytes = [115, 115, 0, 2, 0, 8, 116, 101, 115, 116, 75, 101, 121, 49, 0, 10, 116, 101, 115, 116,
    86, 97, 108, 117, 101, 49, 0, 8, 116, 101, 115, 116, 75, 101, 121, 50, 0, 10, 116, 101, 115, 116, 86,
    97, 108, 117, 101, 50, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
  // When
  const dictionary = typeDecoders.decodeTypeDictionary(bytes);
  // Then
  expect(dictionary).toEqual({'testKey1': 'testValue1', 'testKey2': 'testValue2'});
});

test('decodeTypeArray', () => {
  // Given
  const bytes = [
      0, 2, 115, 0, 5, 116, 101, 115, 116, 49, 0, 5, 116, 101, 115, 116, 50, 0, 0, 0, 0,
      0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  ];
  // When
  const array = typeDecoders.decodeTypeArray(bytes);
  // Then
  expect(array).toEqual(['test1', 'test2']);
});
 
test('decodeTypeByte', () => {
  // Given
  const bytes = [6];
  // When
  const byte = typeDecoders.decodeTypeByte(bytes);
  // Then
  expect(byte).toBe(6);
});
 
test('decodeTypeDouble', () => {
  // Given
  const bytes = [64, 147, 74, 51, 51, 51, 51, 51, 0, 0, 0, 0, 0, 0, 0];
  // When
  const double = typeDecoders.decodeTypeDouble(bytes);
  // Then
  expect(double).toBe(1234.55);
});
 
test('decodeTypeEventData', () => {
  // Given
  const bytes = [
      100, 0, 2, 0, 115, 0, 5, 116, 101, 115, 116, 49, 1, 115, 0, 5, 116, 101, 115, 116,
      50, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  ];
  // When
  const eventData = typeDecoders.decodeTypeEventData(bytes);
  // Then
  expect(eventData).toEqual({'code': 100, 'parameters': {'0': 'test1', '1': 'test2'}});
});
 
test('decodeTypeFloat', () => {
  // Given
  const bytes = [68, 154, 81, 154, 0, 0, 0];
  // When
  const float = typeDecoders.decodeTypeFloat(bytes);
  // Then
  expect(float).toBe(1234.550048828125);
});
 
test('decodeTypeInteger', () => {
  // Given
  const bytes = [0, 0, 4, 210, 0, 0, 0];
  // When
  const integer = typeDecoders.decodeTypeInteger(bytes);
  // Then
  expect(integer).toBe(1234);
});
 
test('decodeTypeShort', () => {
  // Given
  const bytes = [4, 210, 0];
  // When
  const short = typeDecoders.decodeTypeShort(bytes);
  // Then
  expect(short).toBe(1234);
});
 
test('decodeTypeLong', () => {
  // Given
  const bytes = [0, 0, 0, 0, 0, 0, 4, 210, 0, 0, 0, 0, 0, 0, 0];
  // When
  const long = typeDecoders.decodeTypeLong(bytes);
  // Then
  expect(long).toBe(315904);
});
 
test('decodeTypeBooleanArray', () => {
  // Given
  const bytes = [0, 4, 1, 0, 1, 1, 0, 0];
  // When
  const booleanArray = typeDecoders.decodeTypeBooleanArray(bytes);
  // Then
  expect(booleanArray).toEqual([true, false, true, true]);
});
 
test('decodeTypeBoolean', () => {
  // Given
  const bytes = [1];
  // When
  const boolean = typeDecoders.decodeTypeBoolean(bytes);
  // Then
  expect(boolean).toBe(true);
});
 
test('decodeTypeOperationResponse', () => {
  // Given
  const bytes = [
      100, 0, 100, 42, 0, 2, 0, 115, 0, 5, 116, 101, 115, 116, 49, 1, 115, 0, 5, 116,
      101, 115, 116, 50, 0, 0, 0, 0, 0, 0, 0,
  ];
  // When
  const operationResponse = typeDecoders.decodeTypeOperationResponse(bytes);
  // Then
  expect(operationResponse).toEqual({'code': 100, 'debug_message': 'None', 'parameters': {'0': 'test1', '1': 'test2'}, 'return_code': 100});
});
 
test('decodeTypeOperationRequest', () => {
  // Given
  const bytes = [
      100, 0, 2, 0, 115, 0, 5, 116, 101, 115, 116, 49, 1, 115, 0, 5, 116, 101, 115, 116,
      50, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  ];
  // When
  const operationRequest = typeDecoders.decodeTypeOperationRequest(bytes);
  // Then
  expect(operationRequest).toEqual({'code': 100, 'parameters': {'0': 'test1', '1': 'test2'}});
});
 
test('decodeTypeString', () => {
  // Given
  const bytes = [
      0, 12, 116, 101, 115, 116, 95, 109, 101, 115, 115, 97, 103, 101, 0,
  ];
  // When
  const string = typeDecoders.decodeTypeString(bytes);
  // Then
  expect(string).toBe('test_message');
});
 
test('decodeTypeByteArray', () => {
  // Given
  const bytes = [0, 0, 0, 2, 6, 7, 0];
  // When
  const byteArray = typeDecoders.decodeTypeByteArray(bytes);
  // Then
  expect(byteArray).toEqual([6, 7]);
});
 
test('decodeTypeArray (Dictionary)', () => {
  // Given
  const bytes = [
      0, 1, 68, 105, 115, 0, 1, 0, 0, 0, 0, 0, 5, 116, 101, 115, 116, 49, 0, 0, 0, 0, 0,
      0, 0, 0, 0, 0, 0, 0, 0,
  ];
  // When
  const arrayDictionary = typeDecoders.decodeTypeArray(bytes);
  // Then
  expect(arrayDictionary).toEqual([{"0": "test1"}]);
});
 
test('decodeTypeArray (byteArray)', () => {
  // Given
  const bytes = [0, 1, 120, 0, 0, 0, 4, 0, 2, 4, 8, 0, 0, 0, 0];
  // When
  const arrayByteArray = typeDecoders.decodeTypeArray(bytes);
  // Then
  expect(arrayByteArray).toEqual([[0, 2, 4, 8]]);
});
 
test('decodeTypeArray (array)', () => {
  // Given
  const bytes = [0, 1, 121, 0, 3, 105, 0, 0, 0, 1, 0, 0, 0, 2, 0, 0, 0, 3, 0, 0, 0, 0, 0, 0];
  // When
  const arrayArray = typeDecoders.decodeTypeArray(bytes);
  // Then
  expect(arrayArray).toEqual([[1, 2, 3]]);
});
 
test('decodeTypeObjectArray', () => {
  // Given
  const bytes = [
      0, 2, 115, 0, 5, 116, 101, 115, 116, 49, 115, 0, 5, 116, 101, 115, 116, 50, 0, 0,
      0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  ];
  // When
  const objectArray = typeDecoders.decodeTypeObjectArray(bytes);
  // Then
  expect(objectArray).toEqual(['test1', 'test2']);
});
 

/*

#[test]
fn test('', de =>serialize_string_array() {
 
 // Given const bytes = [
        121, 0, 2, 115, 0, 5, 116, 101, 115, 116, 49, 0, 5, 116, 101, 115, 116, 50, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    ];
  });
    l
    // When
    // Thenet
    expect(When).toBeUndefined(); mut buf = Cursor::new(&value[..]);
    let result = buf.decode();
    assert!(result.is_ok(), 'Unimplemented!');
    const bytes = result.unwrap();

    match value {
        Value::Array(v) => {
            if const bytes::String(val) = &v[0] {
                assert_eq!(val, &"test1".to_owned());
            }
            if const bytes::String(val) = &v[1] {
                assert_eq!(val, &"test2".to_owned());
            }
            return;
        }
        Value::StringArray(v) => {
            return assert_eq!(["test1".to_owned(), "test2".to_owned()], v)
        }
        _ => assert!(false),
    }
}

#[test]
fn test('', te =>st_deserialize_byte() {
  // Given
    const bytes = vec![98, 6];
    let mut buf = Cursor::new(&value[..]);
    let result = buf.decode();
    assert!(result.is_ok(), "Unimplemented!");
    // When
    // Then
    expect(When).toBeUndefined();
});
    const bytes = result.unwrap();
    match value {
        Value::Byte(v) => return assert_eq!(v, 6),
        _ => assert!(false),
    }
}

#[test]
fn test('', de =>serialize_double() {
  // Given
    const bytes = vec![100, 64, 147, 74, 51, 51, 51, 51, 51, 0, 0, 0, 0, 0, 0, 0];
    let mut buf = Cursor::new(&value[..]);
    let result = buf.decode();
    assert!(result.is_ok(), "Unimplemented!");
    // When
    // Then
    expect(When).toBeUndefined();
});
    const bytes = result.unwrap();
    match value {
        Value::Double(v) => return assert_eq!(v, 1234.55),
        _ => assert!(false),
    }
}

#[test]
fn test('', de =>serialize_event_data() {
 
 // Given const bytes = vec![
        101, 100, 0, 2, 0, 115, 0, 5, 116, 101, 115, 116, 49, 1, 115, 0, 5, 116, 101, 115, 116,
        50, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    ];
  });
    l
    // When
    // Thenet
    expect(When).toBeUndefined(); mut buf = Cursor::new(&value[..]);
    let result = buf.decode();
    assert!(result.is_ok(), "Unimplemented!");
    const bytes = result.unwrap();
    match value {
        Value::EventData(v) => {
            assert_eq!(v.code, 100);
            assert_eq!(
                v.parameters.get(&0).unwrap(),
                &Value::String("test1".to_owned())
            );
            return;
        }
        _ => assert!(false),
    }
}

#[test]
fn test('', de =>serialize_float() {
  // Given
    const bytes = vec![102, 68, 154, 81, 154, 0, 0, 0];
    let mut buf = Cursor::new(&value[..]);
    let result = buf.decode();
    assert!(result.is_ok(), "Unimplemented!");
    // When
    // Then
    expect(When).toBeUndefined();
});
    const bytes = result.unwrap();
    match value {
        Value::Float(v) => return assert_eq!(v, 1234.55),
        _ => assert!(false),
    }
}

#[test]
fn test('', de =>serialize_integer() {
  // Given
    const bytes = vec![105, 0, 0, 4, 210, 0, 0, 0];
    let mut buf = Cursor::new(&value[..]);
    let result = buf.decode();
    assert!(result.is_ok(), "Unimplemented!");
    // When
    // Then
    expect(When).toBeUndefined();
});
    const bytes = result.unwrap();
    match value {
        Value::Integer(v) => return assert_eq!(v, 1234),
        _ => assert!(false),
    }
}

#[test]
fn test('', de =>serialize_short() {
  // Given
    const bytes = vec![107, 4, 210, 0];
    let mut buf = Cursor::new(&value[..]);
    let result = buf.decode();
    assert!(result.is_ok(), "Unimplemented!");
    // When
    // Then
    expect(When).toBeUndefined();
});
    const bytes = result.unwrap();
    match value {
        Value::Short(v) => return assert_eq!(v, 1234),
        _ => assert!(false),
    }
}

#[test]
fn test('', de =>serialize_long() {
  // Given
    const bytes = vec![108, 0, 0, 0, 0, 0, 0, 4, 210, 0, 0, 0, 0, 0, 0, 0];
    let mut buf = Cursor::new(&value[..]);
    let result = buf.decode();
    assert!(result.is_ok(), "Unimplemented!");
    // When
    // Then
    expect(When).toBeUndefined();
});
    const bytes = result.unwrap();
    match value {
        Value::Long(v) => return assert_eq!(v, 1234),
        _ => assert!(false),
    }
}

#[test]
fn test('', de =>serialize_integer_array() {
  // Given
    const bytes = vec![121, 0, 2, 105, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0];
    let mut buf = Cursor::new(&value[..]);
    let result = buf.decode();
    assert!(result.is_ok(), "Unimplemented!");
    // When
    // Then
    expect(When).toBeUndefined();
});
    const bytes = result.unwrap();
    match value {
        Value::Array(v) => {
            if const bytes::Integer(val) = v[0] {
                assert_eq!(val, 0);
            }
            if const bytes::Integer(val) = v[1] {
                assert_eq!(val, 1);
            }
            return;
        }
        _ => assert!(false),
    }
}

#[test]
fn test('', de =>serialize_boolean() {
  // Given
    const bytes = vec![111, 1];
    let mut buf = Cursor::new(&value[..]);
    let result = buf.decode();
    assert!(result.is_ok(), "Unimplemented!");
    // When
    // Then
    expect(When).toBeUndefined();
});
    const bytes = result.unwrap();
    match value {
        Value::Boolean(v) => return assert_eq!(v, true),
        _ => assert!(false),
    }
}

#[test]
fn test('', de =>serialize_operation_response() {
 
 // Given const bytes = vec![
        112, 100, 0, 100, 42, 0, 2, 0, 115, 0, 5, 116, 101, 115, 116, 49, 1, 115, 0, 5, 116,
        101, 115, 116, 50, 0, 0, 0, 0, 0, 0, 0,
    ];
  });
    l
    // When
    // Thenet
    expect(When).toBeUndefined(); mut buf = Cursor::new(&value[..]);
    let result = buf.decode();
    assert!(result.is_ok(), "Unimplemented!");
    const bytes = result.unwrap();
    match value {
        Value::OperationResponse(v) => {
            assert_eq!(v.code, 100);
            assert_eq!(v.return_code, 100);
            assert_eq!(
                v.parameters.get(&1).unwrap(),
                &Value::String("test2".to_owned())
            );
            return;
        }
        _ => assert!(false),
    }
}

#[test]
fn test('', de =>serialize_operation_request() {
 
 // Given const bytes = vec![
        113, 100, 0, 2, 0, 115, 0, 5, 116, 101, 115, 116, 49, 1, 115, 0, 5, 116, 101, 115, 116,
        50, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    ];
  });
    l
    // When
    // Thenet
    expect(When).toBeUndefined(); mut buf = Cursor::new(&value[..]);
    let result = buf.decode();
    assert!(result.is_ok(), "Unimplemented!");
    const bytes = result.unwrap();
    match value {
        Value::OperationRequest(v) => {
            assert_eq!(v.code, 100);
            assert_eq!(
                v.parameters.get(&1).unwrap(),
                &Value::String("test2".to_owned())
            );
            return;
        }
        _ => assert!(false),
    }
}

#[test]
fn test('', de =>serialize_string() {
 
 // Given const bytes = vec![
        115, 0, 12, 116, 101, 115, 116, 95, 109, 101, 115, 115, 97, 103, 101, 0,
    ];
    let mut buf = Cursor::new(&value[..]);
  });
    l
    // When
    // Thenet
    expect(When).toBeUndefined(); result = buf.decode();
    assert!(result.is_ok(), "Unimplemented!");
    const bytes = result.unwrap();
    match value {
        Value::String(v) => return assert_eq!(&v, "test_message"),
        _ => assert!(false),
    }
}

#[test]
fn test('', de =>serialize_byte_array() {
  // Given
    const bytes = vec![120, 0, 0, 0, 2, 6, 7, 0];
    let mut buf = Cursor::new(&value[..]);
    let result = buf.decode();
    assert!(result.is_ok(), "Unimplemented!");
    // When
    // Then
    expect(When).toBeUndefined();
});
    const bytes = result.unwrap();
    match value {
        Value::ByteArray(v) => {
            assert_eq!(&v[0], &6);
            assert_eq!(&v[1], &7);
            return;
        }
        _ => assert!(false),
    }
}

#[test]
fn test('', de =>serialize_array_dictionary() {
 
 // Given const bytes = vec![
        121, 0, 1, 68, 105, 115, 0, 1, 0, 0, 0, 0, 0, 5, 116, 101, 115, 116, 49, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0,
    ];
  });
    l
    // When
    // Thenet
    expect(When).toBeUndefined(); mut buf = Cursor::new(&value[..]);
    let result = buf.decode();
    assert!(result.is_ok(), "Unimplemented!");
    const bytes = result.unwrap();
    match value {
        Value::Array(v) => {
            if const bytes::Dictionary(val) = &v[0] {
                assert_eq!(val.get("0").unwrap(), &Value::String("test1".to_owned()));
            }
            return;
        }
        _ => assert!(false),
    }
}

#[test]
fn test('', de =>serialize_array_byte_array() {
  // Given
    const bytes = vec![121, 0, 1, 120, 0, 0, 0, 4, 0, 2, 4, 8, 0, 0, 0, 0];
    let mut buf = Cursor::new(&value[..]);
    let result = buf.decode();
    assert!(result.is_ok(), "Unimplemented!");
    // When
    // Then
    expect(When).toBeUndefined();
});
    const bytes = result.unwrap();

    match value {
        Value::Array(v) => {
            if const bytes::ByteArray(val) = &v[0] {
                assert_eq!(val[0], 0);
                assert_eq!(val[1], 2);
                assert_eq!(val[2], 4);
                assert_eq!(val[3], 8);
                return;
            }
        }
        _ => assert!(false),
    }
}

#[test]
fn test('', de =>serialize_array_array() {
 
 // Given const bytes = vec![
        121, 0, 1, 121, 0, 3, 105, 0, 0, 0, 1, 0, 0, 0, 2, 0, 0, 0, 3, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0,
    ];
  });
    l
    // When
    // Thenet
    expect(When).toBeUndefined(); mut buf = Cursor::new(&value[..]);
    let result = buf.decode();
    assert!(result.is_ok(), "Unimplemented!");
    const bytes = result.unwrap();
    match value {
        Value::Array(v) => {
            if const bytes::Integer(val) = &v[0][0] {
                assert_eq!(val, &1);
            }
            if const bytes::Integer(val) = &v[0][1] {
                assert_eq!(val, &2);
            }
            if const bytes::Integer(val) = &v[0][2] {
                assert_eq!(val, &3);
            }
            return;
        }
        _ => assert!(false),
    }
}

#[test]
fn test('', de =>serialize_object_array() {
 
 // Given const bytes = vec![
        122, 0, 2, 115, 0, 5, 116, 101, 115, 116, 49, 115, 0, 5, 116, 101, 115, 116, 50, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    ];
  });
    l
    // When
    // Thenet
    expect(When).toBeUndefined(); mut buf = Cursor::new(&value[..]);
    let result = buf.decode();
    assert!(result.is_ok(), "Unimplemented!");
    const bytes = result.unwrap();

    match value {
        Value::ObjectArray(v) => {
            if const bytes::Object(val) = &*v[0] {
                assert_eq!(**val, Value::String("test1".to_owned()));
            }
            if const bytes::Object(val) = &*v[1] {
                assert_eq!(**val, Value::String("test2".to_owned()));
            }    
        }
        _ => assert!(false),
    };
}
*/
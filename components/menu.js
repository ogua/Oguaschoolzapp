{/* Income  */}
{permission.includes("viewincomeexpense") && (
  <>
  <DrawerItem 
        focused={focus == '30' ? true: false}
        icon={({color, size}) => (
            <Icon 
              name="cog"
                color={color}
                size={size}
                />
            )}
          label={({color, focused}) => (
              <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
                  <Text {...focused}>Income</Text>
                    {focus == '30' ? (
                        <Ionicons name='arrow-down' size={30} color={color} />
                    ): (
                      <Ionicons name='arrow-up' size={30} color={color} />
                    )}
              </View>
          )}   
        onPress={() => {
          setitemfocus('30');
        }}
    />

{focus == '30' && (
  <>
  {permission.includes("viewsettings") && (
    <>
    <DrawerItem 
        focused={focus == '30' &&  subfocus == '301' ? true: false}
        icon={({color, size}) => (
            <Icon 
              name="circle-outline"
                color={color}
                size={size}
                />
            )}
          label={({color, focused}) => (
              <Text>Category</Text>
          )}   
        onPress={() => {
          setsubFocus('301');
          props.navigation.navigate("Schoolinformation");
        }}
    />
    </>
  )}

{permission.includes("viewsettings") && (
    <>
    <DrawerItem 
        focused={focus == '30' &&  subfocus == '302' ? true: false}
        icon={({color, size}) => (
            <Icon 
              name="circle-outline"
                color={color}
                size={size}
                />
            )}
          label={({color, focused}) => (
              <Text>Record Income</Text>
          )}   
        onPress={() => {
          setsubFocus('302');
          props.navigation.navigate("Smssettings");
        }}
    />
    </>
  )}


{permission.includes("viewsettings") && (
    <>
    <DrawerItem 
        focused={focus == '30' &&  subfocus == '303' ? true: false}
        icon={({color, size}) => (
            <Icon 
              name="circle-outline"
                color={color}
                size={size}
                />
            )}
          label={({color, focused}) => (
              <Text>Notification Settings</Text>
          )}   
        onPress={() => {
          setsubFocus('303');
          props.navigation.navigate("Notificationsettings");
        }}
    />
    </>
  )}


{permission.includes("viewsettings") && (
    <>
    <DrawerItem 
        focused={focus == '30' &&  subfocus == '304' ? true: false}
        icon={({color, size}) => (
            <Icon 
              name="circle-outline"
                color={color}
                size={size}
                />
            )}
          label={({color, focused}) => (
              <Text>Mail Settings</Text>
          )}   
        onPress={() => {
          setsubFocus('304');
          props.navigation.navigate("Mailsettings");
        }}
    />
    </>
  )}


{permission.includes("viewsendmail") && (
    <>
    <DrawerItem 
        focused={focus == '30' &&  subfocus == '305' ? true: false}
        icon={({color, size}) => (
            <Icon 
              name="circle-outline"
                color={color}
                size={size}
                />
            )}
          label={({color, focused}) => (
              <Text>Send Notification</Text>
          )}   
        onPress={() => {
          setsubFocus('305');
          props.navigation.navigate("Sendpushnotification");
        }}
    />
    </>
  )}


{permission.includes("viewteachersreview") && (
    <>
    <DrawerItem 
        focused={focus == '30' &&  subfocus == '306' ? true: false}
        icon={({color, size}) => (
            <Icon 
              name="circle-outline"
                color={color}
                size={size}
                />
            )}
          label={({color, focused}) => (
              <Text>Teachers Review</Text>
          )}   
        onPress={() => {
          setsubFocus('306');
          props.navigation.navigate("AllStudents");
        }}
    />
    </>
  )}


{permission.includes("viewtransactions") && (
    <>
    <DrawerItem 
        focused={focus == '30' &&  subfocus == '307' ? true: false}
        icon={({color, size}) => (
            <Icon 
              name="circle-outline"
                color={color}
                size={size}
                />
            )}
          label={({color, focused}) => (
              <Text>Transactions Per Term</Text>
          )}   
        onPress={() => {
          setsubFocus('307');
          props.navigation.navigate("Transactionsperterm");
        }}
    />
    </>
  )}

{permission.includes("viewtransactions") && (
    <>
    <DrawerItem 
        focused={focus == '30' &&  subfocus == '308' ? true: false}
        icon={({color, size}) => (
            <Icon 
              name="circle-outline"
                color={color}
                size={size}
                />
            )}
          label={({color, focused}) => (
              <Text>Transactions Per Day</Text>
          )}   
        onPress={() => {
          setsubFocus('308');
          props.navigation.navigate("Transactionsperday");
        }}
    />
    </>
  )}

{permission.includes("viewtransactions") && (
    <>
    <DrawerItem 
        focused={focus == '30' &&  subfocus == '309' ? true: false}
        icon={({color, size}) => (
            <Icon 
              name="circle-outline"
                color={color}
                size={size}
                />
            )}
          label={({color, focused}) => (
              <Text>Transactions Per Month</Text>
          )}   
        onPress={() => {
          setsubFocus('309');
          props.navigation.navigate("Transactionspermonth");
        }}
    />
    </>
  )}


  </>
) }
  </>
)}

{/* End Settings  */}





{/* Expenses  */}
{permission.includes("viewincomeexpense") && (
  <>
  <DrawerItem 
        focused={focus == '30' ? true: false}
        icon={({color, size}) => (
            <Icon 
              name="cog"
                color={color}
                size={size}
                />
            )}
          label={({color, focused}) => (
              <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
                  <Text {...focused}>Income</Text>
                    {focus == '30' ? (
                        <Ionicons name='arrow-down' size={30} color={color} />
                    ): (
                      <Ionicons name='arrow-up' size={30} color={color} />
                    )}
              </View>
          )}   
        onPress={() => {
          setitemfocus('30');
        }}
    />

{focus == '30' && (
  <>
  {permission.includes("viewsettings") && (
    <>
    <DrawerItem 
        focused={focus == '30' &&  subfocus == '301' ? true: false}
        icon={({color, size}) => (
            <Icon 
              name="circle-outline"
                color={color}
                size={size}
                />
            )}
          label={({color, focused}) => (
              <Text>Category</Text>
          )}   
        onPress={() => {
          setsubFocus('301');
          props.navigation.navigate("Schoolinformation");
        }}
    />
    </>
  )}

{permission.includes("viewsettings") && (
    <>
    <DrawerItem 
        focused={focus == '30' &&  subfocus == '302' ? true: false}
        icon={({color, size}) => (
            <Icon 
              name="circle-outline"
                color={color}
                size={size}
                />
            )}
          label={({color, focused}) => (
              <Text>Record Expenses</Text>
          )}   
        onPress={() => {
          setsubFocus('302');
          props.navigation.navigate("Smssettings");
        }}
    />
    </>
  )}
  </>
) }
  </>
)}

{/* End Expenses  */}